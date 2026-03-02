﻿from flask import Blueprint, request, jsonify
from app.extensions import db
from firebase_admin import auth as firebase_auth
from app.models.admin import Admin
from app.models.applicant import Applicant
from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService


auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
@auth_bp.route("/admin/login", methods=["POST"])
def admin_login():
    try:
        token = request.json.get("token")

        decoded = verify_firebase_token(token)
        email, name = extract_user_info(decoded)

        admin = Admin.query.filter_by(email=email).first()

        if not admin:
            admin = Admin(
                firebase_uid=decoded.get("uid"),
                username=name if name else email.split("@")[0],
                email=email
            )
            db.session.add(admin)
            db.session.commit()
        result = AuthService.admin_login(token)

        return jsonify({
            "success": True,
            **result
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 40
    
@auth_bp.route("/applicant/login", methods=["POST"])
def applicant_login():
    try:
        token = request.json.get("token")
        result = AuthService.applicant_login(token)

        return jsonify({
            "success": True,
            **result
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 401
    