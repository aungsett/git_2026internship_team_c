import secrets
from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService
from config import Config
from app.models.admin import Admin


auth_bp = Blueprint("auth", __name__)


def _set_auth_cookie(response, session_cookie: str):
    # Session cookie: no max_age / expires so browser clears it when session ends.
    csrf_token = secrets.token_urlsafe(32)

    response.set_cookie(
        Config.SESSION_COOKIE_NAME,
        session_cookie,
        httponly=True,
        secure=Config.COOKIE_SECURE,
        samesite=Config.COOKIE_SAMESITE,
        domain=Config.COOKIE_DOMAIN,
        path="/",
    )

    # CSRF cookie must be readable by frontend JS so it can be echoed in header.
    response.set_cookie(
        Config.CSRF_COOKIE_NAME,
        csrf_token,
        httponly=False,
        secure=Config.COOKIE_SECURE,
        samesite=Config.COOKIE_SAMESITE,
        domain=Config.COOKIE_DOMAIN,
        path="/",
    )

    return response


def _is_valid_csrf_request() -> bool:
    csrf_cookie = request.cookies.get(Config.CSRF_COOKIE_NAME)
    csrf_header = request.headers.get(Config.CSRF_HEADER_NAME)
    return bool(csrf_cookie and csrf_header and csrf_cookie == csrf_header)


@auth_bp.route("/admin/login", methods=["POST"])
def admin_login():
    try:
        token = request.json.get("token")
        result = AuthService.admin_login(token)
        session_cookie = AuthService.create_session_cookie(token)
        response = jsonify({"success": True, **result})
        return _set_auth_cookie(response, session_cookie), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 401


@auth_bp.route("/applicant/login", methods=["POST"])
def applicant_login():
    try:
        token = request.json.get("token")
        result = AuthService.applicant_login(token)
        session_cookie = AuthService.create_session_cookie(token)
        response = jsonify({"success": True, **result})
        return _set_auth_cookie(response, session_cookie), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    if not _is_valid_csrf_request():
        return jsonify({"success": False, "error": "Invalid or missing CSRF token"}), 403

    response = jsonify({"success": True, "message": "Logged out"})
    response.delete_cookie(
        Config.SESSION_COOKIE_NAME,
        path="/",
        domain=Config.COOKIE_DOMAIN,
    )
    response.delete_cookie(
        Config.CSRF_COOKIE_NAME,
        path="/",
        domain=Config.COOKIE_DOMAIN,
    )
    return response, 200


@auth_bp.route("/session", methods=["GET"])
def get_session_status():
    try:
        session_cookie = request.cookies.get(Config.SESSION_COOKIE_NAME)
        decoded = AuthService.verify_session_cookie(session_cookie)
        email = decoded.get("email")

        admin = Admin.query.filter_by(email=email).first()
        if not admin:
            return jsonify({"success": False, "authenticated": False}), 401

        return jsonify(
            {
                "success": True,
                "authenticated": True,
                "role": "admin",
                "email": email,
            }
        ), 200
    except Exception:
        return jsonify({"success": False, "authenticated": False}), 401
