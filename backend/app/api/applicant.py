from flask import Blueprint, request, jsonify
from app.utils.decorators import applicant_required
from app.services.applicant_service import ApplicantService
from app.services.cv_parser_service import CVParserService
from app.utils.cloudinary import generate_upload_signature
from app.extensions import db
import uuid

applicant_bp = Blueprint("applicant", __name__)

@applicant_bp.route("/cloudinary-signature", methods=["GET"])
def get_cloudinary_signature():
    try:
        temp_id = str(uuid.uuid4())
        sig_data = generate_upload_signature(temp_id)
        return jsonify({"success": True, "data": sig_data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@applicant_bp.route("/submit", methods=["POST"])
def submit_application():
    try:
        data = request.get_json()
        applicant = ApplicantService.submit_application(data)
        return jsonify({
            "success": True,
            "message": "Application Submitted",
            "applicant_id": applicant.applicant_id
        }), 201
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@applicant_bp.route("/<int:applicant_id>", methods=["GET"])
def get_applicant(applicant_id):
    try:
        applicant = ApplicantService.get_applicant_by_id(applicant_id)
        return jsonify({
            "success": True,
            "data": {
                "id": applicant.applicant_id,
                "first_name": applicant.first_name,
                "last_name": applicant.last_name,
                "email": applicant.email
            }
        })
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 404

@applicant_bp.route("/<int:applicant_id>", methods=["DELETE"])
def delete_applicant(applicant_id):
    try:
        ApplicantService.delete_applicant(applicant_id)
        return jsonify({
            "success": True,
            "message": "Applicant deleted successfully"
        })
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 404

@applicant_bp.route("/parse-cv", methods=["POST", "OPTIONS"])
def parse_cv():
    if request.method == "OPTIONS":
        from flask import make_response
        response = make_response(jsonify({}), 200)
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

    try:
        data = request.get_json()
        if not data or not data.get("resume_text"):
            return jsonify({"success": False, "error": "resume_text is required"}), 400

        resume_text = data.get("resume_text")
        parsed = CVParserService.parse(resume_text)

        return jsonify({
            "success": True,
            "data": parsed
        }), 200

    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500