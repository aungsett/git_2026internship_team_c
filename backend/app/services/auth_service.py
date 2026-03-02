from firebase_admin import auth as firebase_auth
from app.models.admin import Admin
from app.models.applicant import Applicant
from app.extensions import db


class AuthService:

    @staticmethod
    def verify_firebase_token(token):
        if not token:
            raise ValueError("Token missing")

        return firebase_auth.verify_id_token(token)
    
    @staticmethod
    def extract_user_info(decoded_token):
        email = decoded_token.get("email")
        name = decoded_token.get("name", "")

        if not email:
            raise ValueError("Email not found in token")

        return email, name
    
    @staticmethod
    def admin_login(token):

        decoded = AuthService.verify_firebase_token(token)
        email, name = AuthService.extract_user_info(decoded)

        admin = Admin.query.filter_by(email=email).first()

        if not admin:
            admin = Admin(firebase_uid=decoded.get("uid"), username=name if name else email.split("@")[0], email=email)
            db.session.add(admin)
            db.session.commit()

        return {
            "role": "admin",
            "admin_id": admin.admin_id,
            "email": admin.email
        }
    
    @staticmethod
    def applicant_login(token):

        decoded = AuthService.verify_firebase_token(token)
        email, name = AuthService.extract_user_info(decoded)

        applicant = Applicant.query.filter_by(email=email).first()

        if not applicant:
            name_parts = name.split()
            first_name = name_parts[0] if len(name_parts) > 0 else ""
            last_name = name_parts[1] if len(name_parts) > 1 else ""

            applicant = Applicant(
                first_name=first_name,
                last_name=last_name,
                email=email
            )
            db.session.add(applicant)
            db.session.commit()

        return {
            "role": "applicant",
            "applicant_id": applicant.applicant_id,
            "email": applicant.email
        }
