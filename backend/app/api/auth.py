from flask import Blueprint, request, jsonify
from app.extensions import db
from firebase_admin import auth as firebase_auth
from app.models.admin import Admin
from app.models.applicant import Applicant


auth_bp = Blueprint("auth", __name__, url_prefix="/auth")



# Helper: Verify Firebase Token
def verify_firebase_token(token: str):
    """
    Verifies Firebase ID token and returns decoded data.
    Raises exception if invalid.
    """
    if not token:
        raise ValueError("Token missing")

    return firebase_auth.verify_id_token(token)



# Helper: Extract Basic User Info
def extract_user_info(decoded_token):
    """
    Extracts email and name from decoded Firebase token.
    """
    email = decoded_token.get("email")
    name = decoded_token.get("name", "")

    if not email:
        raise ValueError("Email not found in token")

    return email, name


# ---------------------------------------------------
# Admin Login
# ---------------------------------------------------
@auth_bp.route("/admin/login", methods=["POST"])
def admin_login():
    try:
        token = request.json.get("token")

        decoded = verify_firebase_token(token)
        email, name = extract_user_info(decoded)

        admin = Admin.query.filter_by(email=email).first()

        if not admin:
            admin = Admin(email=email, name=name)
            db.session.add(admin)
            db.session.commit()

        return jsonify({
            "success": True,
            "role": "admin",
            "admin_id": admin.admin_id,
            "email": admin.email
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 401


# Applicant Login
@auth_bp.route("/applicant/login", methods=["POST"])
def applicant_login():
    try:
        token = request.json.get("token")

        decoded = verify_firebase_token(token)
        email, name = extract_user_info(decoded)

        applicant = Applicant.query.filter_by(email=email).first()

        if not applicant:
            # Safe name splitting
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

        return jsonify({
            "success": True,
            "role": "applicant",
            "applicant_id": applicant.applicant_id,
            "email": applicant.email
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 401
