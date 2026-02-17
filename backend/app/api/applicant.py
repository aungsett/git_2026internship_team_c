from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.applicant import Applicant
from app.models.document import Document
from datetime import datetime

applicant_bp = Blueprint("applicant", __name__, url_prefix="/applicant")

@applicant_bp.route("/submit", methods=["POST"])
def submit_application():

    data = request.form
    file = request.files.get("file")

    # 1. Save document first
    document = Document(
        file_name=file.filename,
        file_type="pdf",
        document_url="cloud_url_here",
        uploaded_at=datetime.utcnow()
    )

    db.session.add(document)
    db.session.flush()   # gives document_id

    # 2. Save applicant
    applicant = Applicant(
        document_id=document.document_id,
        first_name=data.get("first_name"),
        last_name=data.get("last_name"),
        email=data.get("email"),
        date_of_birth=data.get("date_of_birth"),
        qualification=data.get("qualification"),
        preferred_course=data.get("preferred_course"),
    )

    db.session.add(applicant)
    db.session.commit()

    return jsonify({
        "success": True,
        "id": applicant.applicant_id
    }), 201


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
