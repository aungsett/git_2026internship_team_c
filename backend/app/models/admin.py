from app.extensions import db
from datetime import datetime

class Admin(db.Model):
    __tablename__ = 'admins'

    admin_id = db.Column(db.Integer, primary_key=True)
    firebase_uid = db.Column(db.String(128), unique=True, nullable=False)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(20), default='admin') 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship: 1 Admin can review many Applicants
    reviews = db.relationship('ApplicationReview', backref='admin', lazy=True)
