from config import db
from werkzeug.security import generate_password_hash, check_password_hash

#creats User data base
class User_db(db.Model):
    __tablename__ = "users"
    email = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(100))
    password = db.Column(db.String(200))
    
    # Define the one-to-one relationship
    #settings = db.relationship('Settings', backref='user', uselist=False, lazy='joined')
    def set_password(self,password):
        self.password = generate_password_hash(password)
    def check_password(self,password):
        return check_password_hash(self.password,password)
    def to_json(self):
        return {
            "email": self.email,
            "name": self.name
        }

class Settings_db(db.Model):
    __bind_key__ = 'settings'
    #__tablename__ = 'settings'
    
    settings_id_email = db.Column(db.String,primary_key=True)
    timer = db.Column(db.Integer)
    blink_timer = db.Column(db.Integer)
    ibi_timer = db.Column(db.Integer)
    def to_json(self):
        return {
            "settings_id_email": self.settings_id_email,
            "timer": self.timer,
            "blink_timer": self.blink_timer,
            "ibi_timer":self.ibi_timer
        }
    # Define the relationship back to User
    #user = db.relationship('User', backref=db.backref('settings', uselist=False))
    
class Blink_db(db.Model):
    __bind_key__ = 'blinking'
    #__tablename__ = 'settings'
    
    #setting_id = db.Column(db.String, db.ForeignKey('users.email'), primary_key=True)
    id = db.Column(db.Integer,primary_key =True)
    blink_email = db.Column(db.String)
    mean_log = db.Column(db.Float)
    Normal_or_Not = db.Column(db.Integer)
    def to_json(self):
        return {
            "id":self.id,
            "blink_email": self.blink_id_email,
            "mean_log": self.mean_log,
            "Normal_or_Not":self.Normal_or_Not
        }