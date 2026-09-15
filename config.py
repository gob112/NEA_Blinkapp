from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
#configs all the things


app =Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_BINDS"] = {
    'settings': 'sqlite:///settings.db',
    'blinking':'sqlite:///blink.db'
    
}
app.config["SQLALCHEMY_TRACK_MODIFICATION"] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)
db = SQLAlchemy(app)
