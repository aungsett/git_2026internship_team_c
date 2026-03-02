import cloudinary
import cloudinary.uploader
import os
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
            resource_type="raw",
            folder="ats_cvs",
            public_id=f"applicant_{applicant_id}_cv",
            overwrite=True
        )

        # ✅ RETURN STRING ONLY
        return result["secure_url"]

    except Exception as e:
        raise Exception(f"Cloudinary upload failed: {str(e)}")