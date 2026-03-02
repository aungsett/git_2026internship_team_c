from datetime import datetime
import re
from app.extensions import db
from app.models.applicant import Applicant
from app.models.document import Document
from app.utils.cloudinary import upload_cv   # ✅ Import here


class ApplicantService:

    @staticmethod
    def submit_application(data, file):

        # -------------------------
        # 1️⃣ Required Field Validation
        # -------------------------
        required_fields = ["first_name", "last_name", "email"]
        for field in required_fields:
            if not data.get(field):
                raise ValueError(f"{field} is required")

        if not file:
            raise ValueError("CV file is required")

        # -------------------------
        # 2️⃣ Email Format Validation
        # -------------------------
        email = data.get("email").strip().lower()

        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, email):
            raise ValueError("Invalid email format")

        # -------------------------
        # 3️⃣ Duplicate Email Check
        # -------------------------
        if Applicant.query.filter_by(email=email).first():
            raise ValueError("Email already exists")

        # -------------------------
        # 4️⃣ File Type Validation
        # -------------------------
        if not file.filename.lower().endswith(".pdf"):
            raise ValueError("Only PDF files are allowed")

        # -------------------------
        # 5️⃣ Date of Birth Processing + Age Check
        # -------------------------
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

        # -------------------------
        # 6️⃣ Create Applicant FIRST
        # -------------------------
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
            skills=data.get("skills", []),
            language=data.get("language", []),
            social_links=data.get("social_links", []),
            professional_summary=data.get("professional_summary"),
            comments=data.get("comments"),
            created_at=datetime.utcnow()
        )

        db.session.add(applicant)
        db.session.flush()  # Generates applicant_id without commit


        # -------------------------
        # 7️⃣ Upload CV to Cloudinary (using applicant_id)
        # -------------------------
        cloud_url = upload_cv(file, applicant.applicant_id)

        # -------------------------
        # 8️⃣ Save Document
        # -------------------------
        document = Document(
            applicant_id=applicant.applicant_id,
            file_name=file.filename,
            file_type="pdf",
            document_url=cloud_url,
            uploaded_at=datetime.utcnow()
        )

        db.session.add(document)
        db.session.commit()

        return applicant
    
    #For applicant to view their application
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