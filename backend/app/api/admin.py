from flask import Blueprint, request, jsonify, Response
from app.services.admin_service import AdminService
from app.utils.decorators import admin_required
import csv
import io

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


@admin_bp.route("/applications", methods=["GET"])
@admin_required
def get_all_applications():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        result = AdminService.get_all_applications(page, per_page)

        return jsonify({
            "success": True,
            "data": result["data"],
            "total": result["total"],
            "pages": result["pages"]
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@admin_bp.route("/applications/<int:id>", methods=["GET"])
def get_single_application(id):
    try:
        data = AdminService.get_single_application(id)
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@admin_bp.route("/applications/<int:id>/review", methods=["PUT"])
def review_application(id):
    try:
        data = request.json
        status = data.get("status")
        comments = data.get("comments")
        admin_id = data.get("admin_id")

        if not status or not admin_id:
            return jsonify({"error": "Status and Admin ID required"}), 400

        AdminService.review_application(id, status, comments, admin_id)

        return jsonify({"success": True, "message": "Status updated"}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@admin_bp.route("/export", methods=["GET"])
def export_csv():
    try:
        from app.models.applicant import Applicant

        applicants = Applicant.query.all()

        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow([
            "ID", "Name", "Email", "Phone",
            "Qualification", "Experience", "Summary"
        ])

        for app in applicants:
            writer.writerow([
                app.applicant_id,
                f"{app.first_name} {app.last_name}",
                app.email,
                app.phone_number,
                app.qualification,
                app.work_experience,
                app.professional_summary
            ])

        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={
                "Content-Disposition":
                "attachment;filename=applicants_export.csv"
            }
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500