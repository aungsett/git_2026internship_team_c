from app.extensions import db
from app.models.applicant import Applicant
from datetime import datetime



def create_applicant(data):
    """
    Creates a new applicant after validating business rules.
    """

    # -------- Business Validations --------
    if not data.get("first_name"):
        raise ValueError("First name is required")

    if not data.get("last_name"):
        raise ValueError("Last name is required")

    if not data.get("email"):
        raise ValueError("Email is required")

    # Email uniqueness check
    existing = Applicant.query.filter_by(email=data["email"]).first()
    if existing:
        raise ValueError("Email already exists")

    # -------- Create Applicant --------
    applicant = Applicant(
        first_name=data["first_name"],
        last_name=data["last_name"],
        date_of_birth=data.get("date_of_birth"),
        email=data["email"],
        address=data.get("address"),
        phone_number=data.get("phone_number"),
        qualification=data.get("qualification"),
        college=data.get("college"),
        work_experience=data.get("work_experience"),
        preferred_japanese_course=data.get("preferred_japanese_course"),
        skills=data.get("skills", []),
        language=data.get("language", []),
        social_links=data.get("social_links", []),
        professional_summary=data.get("professional_summary"),
        comments=data.get("comments"),
        created_at=datetime.utcnow()
    )

    db.session.add(applicant)
    db.session.commit()

    return applicant



# READ - Single
def get_applicant_by_id(applicant_id):
    applicant = Applicant.query.get(applicant_id)

    if not applicant:
        raise ValueError("Applicant not found")

    return applicant



# READ - All
def get_all_applicants():
    return Applicant.query.order_by(Applicant.created_at.desc()).all()


def update_applicant(applicant_id, data):
    applicant = Applicant.query.get(applicant_id)

    if not applicant:
        raise ValueError("Applicant not found")

    # Email uniqueness check (if updating email)
    if "email" in data and data["email"] != applicant.email:
        existing = Applicant.query.filter_by(email=data["email"]).first()
        if existing:
            raise ValueError("Email already exists")
        applicant.email = data["email"]

    # Update fields safely
    applicant.first_name = data.get("first_name", applicant.first_name)
    applicant.last_name = data.get("last_name", applicant.last_name)
    applicant.phone_number = data.get("phone_number", applicant.phone_number)
    applicant.address = data.get("address", applicant.address)
    applicant.qualification = data.get("qualification", applicant.qualification)
    applicant.college = data.get("college", applicant.college)
    applicant.work_experience = data.get("work_experience", applicant.work_experience)
    applicant.preferred_japanese_course = data.get(
        "preferred_japanese_course",
        applicant.preferred_japanese_course
    )
    applicant.skills = data.get("skills", applicant.skills)
    applicant.language = data.get("language", applicant.language)
    applicant.social_links = data.get("social_links", applicant.social_links)
    applicant.professional_summary = data.get(
        "professional_summary",
        applicant.professional_summary
    )
    applicant.comments = data.get("comments", applicant.comments)

    db.session.commit()

    return applicant




def delete_applicant(applicant_id):
    applicant = Applicant.query.get(applicant_id)

    if not applicant:
        raise ValueError("Applicant not found")

    db.session.delete(applicant)
    db.session.commit()

    return True