from app.extensions import db
from datetime import datetime

class Document(db.Model):
    __tablename__ = 'documents'

    document_id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Key to Applicant
    review_id = db.Column(db.Integer, db.ForeignKey('application_reviews.review_id'), nullable=False, unique=True)
    
    file_name = db.Column(db.String(100))
    file_type = db.Column(db.String(10))
    document_url = db.Column(db.String(255), nullable=False) # Cloudinary URL
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)