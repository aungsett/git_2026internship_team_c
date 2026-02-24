import firebase_admin
from firebase_admin import credentials
import os
from dotenv import load_dotenv


def initialize_firebase():
    load_dotenv()

    if not firebase_admin._apps:
        cred_path = os.getenv("FIREBASE_CREDENTIALS")

        if not cred_path:
            raise ValueError("FIREBASE_CREDENTIALS not set in environment")

        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
