from flask import request,jsonify
from config import app,db
from model import User_db,Settings_db,Blink_db
from flask_cors import CORS
from get_ibi import Get_ibi
import os
import math as m
import joblib
import numpy as np
from multiprocessing import Process
from threading import Event
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash


from flask_cors import CORS, cross_origin

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
alert_event = Event()


dry_eyes_model= joblib.load('logistic_model.pkl')
ibi = Get_ibi()





#check predictions and start timer if 1 more than 0
def check_predictions_and_run(email):
    
    with app.app_context():
        recent_entries = Blink_db.query.filter_by(blink_email=email).order_by(Blink_db.id.desc()).limit(5).all()
        count_0 = sum(1 for entry in recent_entries if entry.Normal_or_Not == 0)
        count_1 = sum(1 for entry in recent_entries if entry.Normal_or_Not == 1)
    if count_0 <= count_1:
       return 1
    else:
       return 0
        



#get ibi from video log the mean and pass it through logisitc model
def process_video(file,email):
    if email:
        
        times = ibi.get_blinks(file)
        Ibi_times = [(m.log(i[0][1], 10)) for i in times if i and i[0][1] > 0]
        
        os.remove(f"./uploads/{file}")
        mean_log_Ibi = 0
        probability = 0  # Default value for the missing feature
        prediction = 0
        if len(Ibi_times) != 0:
            mean_log_Ibi = sum(Ibi_times) / len(Ibi_times)
            probability = 0  # Default value for the missing feature
            input_data = np.array([[mean_log_Ibi, probability]])
            prediction = dry_eyes_model.predict(input_data)
            prediction = prediction[0]

        with app.app_context():
            new_entry = Blink_db(blink_email=email,mean_log=mean_log_Ibi,Normal_or_Not=prediction)
            db.session.add(new_entry)
            db.session.commit()
            
 


# API to display a user thats already in the User database
@app.route("/users",methods=["GET"])

def get_user():
    email = request.args.get("email")
    user = User_db.query.get(email)
    if user:
        return jsonify({'name':user.name})
    else:
        return jsonify({'error':'user not found'}),404
    
    
@app.route("/login",methods=["POST"])

def already_user():
    data = request.get_json()
    user = User_db.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        token = create_access_token(identity=user.email)
        return jsonify(token=token)
    return jsonify(error="Invalid credentials"), 401
    
    
    
#API to recieve forms data and store in User database
@app.route("/create_contact",methods=["POST"])
def create_user():

    email= request.json.get("email")
    name= request.json.get("name")
    password= request.json.get("password")
    
    if not name or not password or not email:
        return (jsonify({"messege":"no"}),400)
    if User_db.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 409
    
    new_user = User_db(email=email,name=name)
    new_user.set_password(password)
    
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as E:
        return jsonify({"messege from back":str(E)}),400

    return jsonify({"messege":"done and dusted"}),201

# stores results from the user in the settings database

@app.route("/set_settings", methods=["POST"])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
def set_Settings():
    email = request.json.get("email")
    timer = int(request.json.get("timer"))
    blink_timer = int(request.json.get("blink_timer"))
    ibi_timer = int(request.json.get("ibi_timer"))

    if not email or not timer or not blink_timer or not ibi_timer:
        return jsonify({"message": "Incomplete data"}), 400

    settings = Settings_db.query.filter_by(settings_id_email=email).first()

    if settings:
        settings.timer = timer
        settings.blink_timer = blink_timer
        settings.ibi_timer = ibi_timer
    else:
        settings = Settings_db(
            settings_id_email=email,
            timer=timer,
            blink_timer=blink_timer,
            ibi_timer=ibi_timer
        )
        db.session.add(settings)

    db.session.commit()
    return jsonify({"message": "Settings saved successfully"}), 201



#get users settings and sends it to front end
@app.route("/users_settings",methods=["GET"])

def get_user_settings():
    email = request.args.get("email")
    users = Settings_db.query.get(email)
    
    
    if users:
        return jsonify({'timer': users.timer,
                        "blink_timer":users.blink_timer,
                        "ibi_timer":users.ibi_timer
                        })
    else:
        return jsonify({'error': 'User not found'}), 404
    
    
#get vedio recording and call process_video
@app.route("/video_recording", methods=["POST"])
def video():
   
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
   
    file = request.files['file']
    email = request.form.get('email')
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    file_path = f"./uploads/{file.filename}"
    file.save(file_path)
   
    #multiprocessing so when video is sent no confilcs can arise and to make processing of multiple videos quicker
    p = Process(target=process_video, args=(file.filename,email))
    p.start()
    
    
    return jsonify({"success": True, "message": "Video processed successfully."})


#give predictions to front end so if 1 can start a timer
@app.route("/get_predictions", methods=["GET"])
def get_pred():
    email = request.args.get("email")
    start_timer = check_predictions_and_run(email)
    return jsonify({'start_timer': start_timer})


#gives stats to display
@app.route("/get_stats", methods=["GET"])
def get_stats():
    x = 0
    final = []
    email = request.args.get("email")
    recent_entries = Blink_db.query.filter_by(blink_email=email).all()
   
    for d in recent_entries:
        x+=1
        final.append({"time":x,"mean_log_ibi":d.mean_log})
        
    
    return jsonify(final)



if __name__== "__main__":
      # Initialize Tkinter here, in the main thread
  
   
    with app.app_context():
        db.create_all()
    
    app.run(debug=True)
    