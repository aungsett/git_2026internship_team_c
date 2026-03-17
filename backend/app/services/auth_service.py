from firebase_admin import auth as firebase_auth
from app.models.admin import Admin
from app.models.applicant import Applicant
from app.extensions import db


class AuthService:


    @staticmethod
    def verify_token(token):
        if not token:
            raise ValueError("Token missing")
        
        decoded = firebase_auth.verify_id_token(token)
        
        return {
            "uid": decoded.get("uid"),
            "email": decoded.get("email"),
            "name": decoded.get("name", "")
        }
    
    
    @staticmethod
    def admin_login(token):

        decoded = AuthService.verify_token(token)
        email = decoded["email"]
        name = decoded["name"]

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
        decoded = AuthService.verify_token(token)
        email, _ = decoded["email"]
    
        applicant = Applicant.query.filter_by(email=email).first()
    
        return {
            "role": "applicant",
            "applicant_id": applicant.applicant_id if applicant else None,
            "email": email
        }
    
