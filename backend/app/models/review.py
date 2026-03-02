from app.extensions import db
from datetime import datetime

class ApplicationReview(db.Model):
    __tablename__ = 'application_reviews'

    review_id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Keys
    applicant_id = db.Column(db.Integer, db.ForeignKey('applicants.applicant_id'), nullable=False,unique=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.admin_id'), nullable=False)
    
    status = db.Column(db.String(30), default="Pending") # Pending/Shortlisted/Rejected
    comments = db.Column(db.Text)
    reviewed_at = db.Column(db.DateTime, default=datetime.utcnow)