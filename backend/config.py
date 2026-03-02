import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,       # Tests connection before using it — auto-reconnects if Neon woke up
        "pool_recycle": 280,         # Recycles connections every 280 seconds before Neon kills them
        "pool_size": 5,
        "max_overflow": 2,
    }

    if not SQLALCHEMY_DATABASE_URI:
        raise ValueError("DATABASE_URL is missing. Check your .env file.")