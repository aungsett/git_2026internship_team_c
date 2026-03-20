from functools import wraps
from flask import request, jsonify, g
from app.services.auth_service import AuthService
from app.extensions import db
from app.models.admin import Admin
from app.models.applicant import Applicant
from config import Config


def _validate_csrf():
    if request.method in {"GET", "HEAD", "OPTIONS"}:
        return None

    csrf_cookie = request.cookies.get(Config.CSRF_COOKIE_NAME)
    csrf_header = request.headers.get(Config.CSRF_HEADER_NAME)

    if not csrf_cookie or not csrf_header or csrf_cookie != csrf_header:
        return jsonify({"error": "Invalid or missing CSRF token"}), 403

    return None

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            csrf_error = _validate_csrf()
            if csrf_error:
                return csrf_error

            session_cookie = request.cookies.get(Config.SESSION_COOKIE_NAME)
            decoded_token = AuthService.verify_session_cookie(session_cookie)

            email = decoded_token.get("email")
            admin = Admin.query.filter_by(email=email).first()
            if not admin:
                return jsonify({"error": "Forbidden - Admin access required"}), 403

            request.user = decoded_token

        except ValueError:
            return jsonify({"error": "Authentication required"}), 401
        except Exception:
            return jsonify({"error": "Authentication failed"}), 401
        return f(*args, **kwargs)
    return decorated_function

def applicant_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            csrf_error = _validate_csrf()
            if csrf_error:
                return csrf_error

            session_cookie = request.cookies.get(Config.SESSION_COOKIE_NAME)
            decoded_token = AuthService.verify_session_cookie(session_cookie)

            email = decoded_token.get("email")
            applicant = Applicant.query.filter_by(email=email).first()
            if not applicant:
                return jsonify({"error": "Forbidden - Applicant access required"}), 403

            g.user = decoded_token

        except ValueError:
            return jsonify({"error": "Authentication required"}), 401
        except Exception:
            return jsonify({"error": "Authentication failed"}), 401
        return f(*args, **kwargs)
    return decorated_function
