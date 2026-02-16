import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    if not SQLALCHEMY_DATABASE_URI:
        raise ValueError("DATABASE_URL is missing. Check your .env file.")