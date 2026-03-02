from flask import Blueprint, request, jsonify
from app.utils.decorators import applicant_required
from app.services.applicant_service import ApplicantService
from app.extensions import db

applicant_bp = Blueprint("applicant", __name__, url_prefix="/applicant")


@applicant_bp.route("/submit", methods=["POST"])
#@applicant_required
def submit_application():
    try:
        data = request.form
        file = request.files.get("file")

        applicant = ApplicantService.submit_application(data, file)

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