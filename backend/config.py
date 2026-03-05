import os
from dotenv import load_dotenv

load_dotenv()

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

    if not SQLALCHEMY_DATABASE_URI:
        raise ValueError("DATABASE_URL is missing. Check your .env file.")
        
    if not MAIL_USERNAME or not MAIL_PASSWORD:
        raise ValueError("Email credentials (MAIL_USERNAME or MAIL_PASSWORD) are missing in .env")