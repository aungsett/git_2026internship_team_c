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
    def create_session_cookie(token, expires_in_seconds=60 * 60 * 8):
        if not token:
            raise ValueError("Token missing")

        return firebase_auth.create_session_cookie(
            token, expires_in=expires_in_seconds
        )

    @staticmethod
    def verify_session_cookie(session_cookie):
        if not session_cookie:
            raise ValueError("Session cookie missing")

        return firebase_auth.verify_session_cookie(session_cookie, check_revoked=True)
    
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
        email, _ = AuthService.extract_user_info(decoded)
    
        applicant = Applicant.query.filter_by(email=email).first()
    
        return {
            "role": "applicant",
            "applicant_id": applicant.applicant_id if applicant else None,
            "email": email
        }
