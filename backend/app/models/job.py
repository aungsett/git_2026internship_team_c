from app.extensions import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY


class Job(db.Model):
    __tablename__ = "jobs"

    # Primary Key
    id = db.Column(db.Integer, primary_key=True)

    # Business Job ID (Visible to users)
    job_id = db.Column(db.String(50), unique=True, nullable=False)

    # Basic Job Information
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(100), nullable=False)

    # Additional Details
    employment_type = db.Column(db.String(50), nullable=False)  

    # Example: Full-time, Internship, Contract
    department = db.Column(db.String(100), nullable=True)
    salary_range = db.Column(db.String(100), nullable=True)
    experience_required = db.Column(db.Integer, nullable=True, default=0)
    skills = db.Column(ARRAY(db.String),nullable=True)
    application_deadline = db.Column(db.Date, nullable = True)


    # Job Status
    status = db.Column(db.String(20), default="draft")  
    # Draft/ Published

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    #Relationship
    applications = db.relationship('ApplicationReview', backref='job', lazy=True)

    def __repr__(self):
        return f"<Job {self.title}>"