from functools import wraps
from flask import request, jsonify, g
from firebase_admin import auth


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

            if decoded_token.get("role") != "admin":
                return jsonify({"error": "Forbidden - Admin access required"}), 403

            request.user = decoded_token

        except auth.ExpiredIdTokenError:
            return jsonify({"error": "Token expired"}), 401
        except auth.InvalidIdTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except Exception:
            return jsonify({"error": "Authentication failed"}), 401

        return f(*args, **kwargs)

    return decorated_function

def applicant_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401

        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Invalid authorization format"}), 401

        try:
            token = auth_header.split(" ")[1]

            # Verify Firebase ID token
            decoded_token = auth.verify_id_token(token)

            # Check role
            if decoded_token.get("role") != "applicant":
                return jsonify({"error": "Forbidden - Applicant access required"}), 403

            # Store user in Flask global context
            g.user = decoded_token

        except auth.ExpiredIdTokenError:
            return jsonify({"error": "Token expired"}), 401
        except auth.InvalidIdTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except Exception:
            return jsonify({"error": "Authentication failed"}), 401

        return f(*args, **kwargs)

    return decorated_function
