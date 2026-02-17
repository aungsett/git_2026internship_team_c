from flask import Blueprint, jsonify, request
from app.auth.auth_middleware import admin_required
admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/test")
#@admin_required
def admin_test():
    return {"message": "Admin access granted"}

@admin_bp.route("/profile", methods=["GET"])
#@admin_required
def profile():
    # request.user is automatically populated by your admin_required decorator
    return jsonify({
        "message": "Access granted",
        "user": request.user
    }), 200