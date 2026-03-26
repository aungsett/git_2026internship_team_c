from flask import Blueprint, request, jsonify, Response
from app.services.admin_service import AdminService
from app.services.job_service import JobService
from app.utils.decorators import admin_required


admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/applications", methods=["GET"])
@admin_required
def get_all_applications():
    try:
        
        result = AdminService.get_all_applications()

        return jsonify({
            "success": True,
            **result
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    

@admin_bp.route("/applications/<int:id>", methods=["GET"])
@admin_required
def get_single_application(id):
    try:
        data = AdminService.get_single_application(id)

        return jsonify({"success": True, "data": data}), 200

    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 404
    

@admin_bp.route("/applications/<int:id>/review", methods=["PUT"])
@admin_required
def review_application(id):
    try:
        data = request.json

        AdminService.review_application(
            applicant_id=id,
            job_id=data.get("job_id"),
            status=data.get("status"),
            admin_id=data.get("admin_id")
        )

        return jsonify({
            "success": True,
            "message": "Status updated"
        }), 200

    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400


    except Exception as e:
        
        return jsonify({"success": False, "error": str(e)}), 500
    

@admin_bp.route("/export", methods=["GET"])
@admin_required
def export_csv():
    try:
        csv_data = AdminService.export_applicants_csv()

        return Response(
            csv_data,
            mimetype="text/csv",
            headers={
                "Content-Disposition":
                "attachment;filename=applicants_export.csv"
            }
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@admin_bp.route("/jobs", methods=["GET"])
@admin_required
def get_all_jobs():
    try:
        
        result = AdminService.get_all_jobs()

        return jsonify({
            "success": True,
            **result
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@admin_bp.route("/create-jobs", methods=["POST"])
@admin_required
def create_job():
    try:
        data = request.json

        JobService.create_job(data)

        return jsonify({
            "success": True,
            "message": "Job created successfully"
        }), 201

    except ValueError as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

    except Exception:
        return jsonify({
            "success": False,
            "error": "Failed to create job"
        }), 500
    
    
@admin_bp.route("/jobs/<int:job_id>", methods=["PUT"])
@admin_required
def update_job(job_id):
    try:
        data = request.json

        job = AdminService.update_job(job_id, data)

        return jsonify({
            "success": True,
            "message": "Job updated successfully",
            "job_id": job.job_id,
            "status": job.status
        }), 200

    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500