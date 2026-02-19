from functools import wraps
from flask import request, jsonify
from firebase_admin import auth
from app.models.admin import Admin  # adjust if path differs


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401

        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Invalid authorization format"}), 401

        try:
            token = auth_header.split(" ")[1]

            decoded_token = auth.verify_id_token(token)

            uid = decoded_token.get("uid")

            if not uid:
                return jsonify({"error": "Invalid token payload"}), 401

            admin = Admin.query.filter_by(firebase_uid=uid).first()

            if not admin:
                return jsonify({"error": "Forbidden - Not an admin"}), 403

            if admin.role != "admin":
                return jsonify({"error": "Forbidden - Admin role required"}), 403

            request.user = {
                "uid": uid,
                "email": admin.email,
                "role": admin.role,
                "admin_id": admin.admin_id
            }

        except auth.ExpiredIdTokenError:
            return jsonify({"error": "Token expired"}), 401
        except auth.InvalidIdTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except Exception:
            return jsonify({"error": "Authentication failed"}), 401

        return f(*args, **kwargs)

    return decorated_function
