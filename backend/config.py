import os
from dotenv import load_dotenv
load_dotenv()


def _to_bool(value, default=False):
    if value is None:
        return default
    return str(value).strip().lower() in {"1", "true", "yes", "on"}

class Config:
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 280,
        "pool_size": 5,
        "max_overflow": 2,
    }

    # Gmail SMTP Configuration
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')

    # Gemini API
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

    # Auth cookie configuration
    COOKIE_SECURE = _to_bool(os.getenv('COOKIE_SECURE'), default=False)
    COOKIE_SAMESITE = os.getenv('COOKIE_SAMESITE', 'Lax')
    COOKIE_DOMAIN = os.getenv('COOKIE_DOMAIN') or None
    SESSION_COOKIE_NAME = os.getenv('SESSION_COOKIE_NAME', 'session')

    # CSRF configuration for cookie-based auth
    CSRF_COOKIE_NAME = os.getenv('CSRF_COOKIE_NAME', 'csrf_token')
    CSRF_HEADER_NAME = os.getenv('CSRF_HEADER_NAME', 'X-CSRF-Token')

    if not SQLALCHEMY_DATABASE_URI:
        raise ValueError("DATABASE_URL is missing. Check your .env file.")

    if not MAIL_USERNAME or not MAIL_PASSWORD:
        raise ValueError("Email credentials (MAIL_USERNAME or MAIL_PASSWORD) are missing in .env")