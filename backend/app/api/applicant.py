from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.applicant import Applicant
from app.models.document import Document
from datetime import datetime

applicant_bp = Blueprint("applicant", __name__, url_prefix="/applicant")

@applicant_bp.route("/submit", methods=["POST"])
def submit_application():
    try:
        data = request.form
        file = request.files.get("file")

        if not file:
            return jsonify({"error": "CV file is required"}), 400

        # 1. Save Applicant
        dob_str = data.get("date_of_birth")
        dob_obj = datetime.strptime(dob_str, '%Y-%m-%d') if dob_str else None

        applicant = Applicant(
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            email=data.get("email"),
            date_of_birth=dob_obj,
            qualification=data.get("qualification"),
            preferred_japanese_course=data.get("preferred_course")
        )

        db.session.add(applicant)
        db.session.flush() # This generates applicant.applicant_id without committing

        # 2. Save Document
        # TODO: Call Cloudinary Service here to get real URL
        cloud_url = f"https://cloudinary.com/{file.filename}" 
        
        document = Document(
            applicant_id=applicant.applicant_id,
            file_name=file.filename,
            file_type="pdf",
            document_url=cloud_url,
	    uploaded_at=datetime.utcnow()
        )

        db.session.add(document)
        
        # 3. Commit everything together
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Application Submitted",
            "applicant_id": applicant.applicant_id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@applicant_bp.route("/parse-cv", methods=["POST"])
def parse_cv():

    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Temporary fake AI response (replace later with Gemini)
    parsed_data = {
        "first_name": "John",
        "last_name": "Doe",
        "skills": ["Python", "Machine Learning"],
        "professional_summary": "AI parsed CV summary",
        "work_experience": 2
    }

    return jsonify({
        "success": True,
        "data": parsed_data
    }), 200
