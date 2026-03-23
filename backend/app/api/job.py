from flask import Blueprint, request, jsonify
from app.services.job_service import JobService
from app.utils.decorators import admin_required


job_bp = Blueprint("job", __name__)


@job_bp.route("/", methods=["GET"])
def get_all_jobs():
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)

        result = JobService.get_all_jobs(page, per_page)

        return jsonify({
            "success": True,
            **result
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@job_bp.route("/<string:job_id>", methods=["GET"])
def get_single_job(job_id):
    try:
        data = JobService.get_single_job(job_id)

        return jsonify({"success": True, "data": data}), 200

    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 404


@job_bp.route("/", methods=["POST"])
@admin_required
def create_job():
    try:
        JobService.create_job(request.json)

        return jsonify({
            "success": True,
            "message": "Job created successfully"
        }), 201

    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@job_bp.route("/<int:id>", methods=["DELETE"])
@admin_required
def delete_job(id):
    try:
        JobService.delete_job(id)

        return jsonify({
            "success": True,
            "message": "Job deleted successfully"
        }), 200

    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 404

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500