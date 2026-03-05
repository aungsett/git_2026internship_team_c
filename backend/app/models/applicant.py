from app.extensions import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY

class Applicant(db.Model):
    __tablename__ = "applicants"

    # Primary Key
    applicant_id = db.Column(db.Integer, primary_key=True)

    # Basic Info
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    date_of_birth = db.Column(db.Date)
    email = db.Column(db.String(100), unique=True, nullable=False)
    address = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))

    # Education / Career
    qualification = db.Column(db.String(50))
    college = db.Column(db.String(100))
    work_experience = db.Column(db.Integer)

    # Course Preference
    preferred_japanese_course = db.Column(db.Text)

    # Arrays
    skills = db.Column(ARRAY(db.String))
    language = db.Column(ARRAY(db.String))
    social_links = db.Column(ARRAY(db.String))

    # AI Parsed Fields
    professional_summary = db.Column(db.Text)
    comments = db.Column(db.String(100))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # 1 Applicant <-> 1 Document
    document = db.relationship("Document", backref="applicant", uselist=False, lazy=True)

    # 1 Applicant <-> Many Reviews
    reviews = db.relationship("ApplicationReview", backref="applicant", lazy=True, order_by="ApplicationReview.reviewed_at.desc()")

    def __repr__(self):
        return f"<Applicant {self.email}>"

    # Helper to send JSON to Frontend
    def to_dict(self):
        return {
            "applicant_id": self.applicant_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone_number": self.phone_number,
            "skills": self.skills,
            "summary": self.professional_summary,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
