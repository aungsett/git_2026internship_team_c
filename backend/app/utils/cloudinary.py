import cloudinary
import cloudinary.uploader
import cloudinary.utils
import os
import time
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def upload_cv(file, applicant_id):
    try:
        result = cloudinary.uploader.upload(
            file,
            resource_type="auto",
            folder="ats_cvs",
            public_id=f"applicant_{applicant_id}_cv",
            overwrite=True
        )
        return result["secure_url"]
    except Exception as e:
        raise Exception(f"Cloudinary upload failed: {str(e)}")

def generate_upload_signature(applicant_id: str):
    timestamp = int(time.time())
    params = {
        "timestamp": timestamp,
        "folder": "ats_cvs",
        "public_id": f"applicant_{applicant_id}_cv",
        "overwrite": True,
    }
    signature = cloudinary.utils.api_sign_request(
        params, os.getenv("CLOUDINARY_API_SECRET")
    )
    return {
        "signature": signature,
        "timestamp": timestamp,
        "cloud_name": os.getenv("CLOUDINARY_CLOUD_NAME"),
        "api_key": os.getenv("CLOUDINARY_API_KEY"),
        "folder": "ats_cvs",
        "public_id": f"applicant_{applicant_id}_cv",
    }