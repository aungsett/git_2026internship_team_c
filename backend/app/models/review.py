from app.extensions import db
from datetime import datetime

class ApplicationReview(db.Model):
    __tablename__ = 'application_reviews'

    review_id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Keys
    applicant_id = db.Column(db.Integer, db.ForeignKey('applicants.applicant_id'), nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.admin_id'), nullable=True)
    job_id = db.Column(db.String(50), db.ForeignKey('jobs.job_id'), nullable=False)
    
    status = db.Column(db.String(30), default="Pending") # Pending/Shortlisted/Rejected
    comments = db.Column(db.Text)
    reviewed_at = db.Column(db.DateTime, default=datetime.utcnow)

    document = db.relationship("Document", backref= "review", uselist=False)

    #prevent duplicate applications
    __table_args__ = (
        db.UniqueConstraint('applicant_id', 'job_id', name='unique_application'),
    )