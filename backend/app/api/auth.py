from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/admin/login", methods=["POST"])
def admin_login():
    try:
        token = request.json.get("token")
        result = AuthService.admin_login(token)
        return jsonify({"success": True, **result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 401


@auth_bp.route("/applicant/login", methods=["POST"])
def applicant_login():
    try:
        token = request.json.get("token")
        result = AuthService.applicant_login(token)
        return jsonify({"success": True, **result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 401
    

@auth_bp.route("/admin/verify", methods=["POST"])
def verify_admin():
    try:
        token = request.json.get("token")

        if not token:
            return jsonify({"valid": False}), 401

        user = AuthService.verify_token(token)

        return jsonify({
            "valid": True,
            "user": user
        }), 200

    except Exception:
        return jsonify({"valid": False}), 401
