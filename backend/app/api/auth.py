from flask import Blueprint, request, jsonify
from app.extensions import db
from firebase_admin import auth as firebase_auth
from app.models.admin import Admin

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/login", methods=["POST"])
def login():

    token = request.json.get("token")

    if not token:
        return jsonify({"error": "Token missing"}), 400

    try:
        decoded = firebase_auth.verify_id_token(token)

        email = decoded.get("email")
        name = decoded.get("name")

        admin = Admin.query.filter_by(email=email).first()

        if not admin:
            admin = Admin(email=email, name=name)
            db.session.add(admin)
            db.session.commit()

        return jsonify({
            "success": True,
            "admin_id": admin.admin_id,
            "email": admin.email
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 401
