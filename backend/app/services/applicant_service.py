from datetime import datetime
from app.extensions import db
from app.models.applicant import Applicant
from app.models.document import Document
from app.utils.cloudinary import upload_cv
from app.utils.validators import validate_email, validate_file_type, validate_file_size


class ApplicantService:

    @staticmethod
    def submit_application(data, file):
        required_fields = ["first_name", "last_name", "email"]
        for field in required_fields:
            if not data.get(field):
                raise ValueError(f"{field} is required")

        if not file:
            raise ValueError("CV file is required")

        email = data.get("email").strip().lower()

        if not validate_email(email):
            raise ValueError("Invalid email format")

        if Applicant.query.filter_by(email=email).first():
            raise ValueError("Email already exists")

        if not validate_file_type(file.filename):
            raise ValueError("Only PDF files are allowed")

        if not validate_file_size(file):
            raise ValueError("File size must be under 2MB")

        dob_str = data.get("date_of_birth")
        dob_obj = None

        if dob_str:
            dob_obj = datetime.strptime(dob_str, "%Y-%m-%d")
            today = datetime.today()
            age = today.year - dob_obj.year - (
                (today.month, today.day) < (dob_obj.month, dob_obj.day)
            )

            if age < 18:
                raise ValueError("Applicant must be at least 18 years old")

        applicant = Applicant(
            first_name=data.get("first_name").strip(),
            last_name=data.get("last_name").strip(),
            email=email,
            date_of_birth=dob_obj,
            qualification=data.get("qualification"),
            address=data.get("address"),
            phone_number=data.get("phone_number"),
            college=data.get("college"),
            work_experience=data.get("work_experience"),
            preferred_japanese_course=data.get("preferred_japanese_course"),
            skills=data.getlist("skills"),
            language=data.getlist("language"),
            social_links=data.getlist("social_links"),
            professional_summary=data.get("professional_summary"),
            comments=data.get("comments"),
            created_at=datetime.utcnow()
        )

        db.session.add(applicant)
        db.session.flush()

        cloud_url = upload_cv(file, applicant.applicant_id)

        document = Document(
            applicant_id=applicant.applicant_id,
            file_name=file.filename,
            file_type="pdf",
            document_url=cloud_url,
            uploaded_at=datetime.utcnow()
        )

        db.session.add(document)
        db.session.commit()

        # Import here to avoid circular import
        from app.services.email_service import EmailService

        # Send application confirmation email
        try:
            EmailService.send_application_received_email(
                applicant.email,
                applicant.first_name
            )
        except Exception as e:
            print("Email sending failed:", e)

        return applicant

    # For applicant to view their application
    @staticmethod
    def get_applicant_by_id(applicant_id):
        applicant = Applicant.query.get(applicant_id)

        if not applicant:
            raise ValueError("Applicant not found")

        return applicant

    @staticmethod
    def delete_applicant(applicant_id):
        applicant = Applicant.query.get(applicant_id)

        if not applicant:
            raise ValueError("Applicant not found")

        db.session.delete(applicant)
        db.session.commit()

        return True