from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.job import Job
from app.utils.decorators import admin_required
from datetime import datetime

job_bp = Blueprint("job", __name__, url_prefix="/jobs")


@job_bp.route("/", methods=["GET"])
def get_all_jobs():
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)

        pagination = Job.query.order_by(Job.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        jobs = pagination.items

        output = []
        for job in jobs:
            output.append({
                "id": job.id,
                "job_id": job.job_id,
                "title": job.title,
                "location": job.location,
                "employment_type": job.employment_type,
                "department": job.department,
                "salary_range": job.salary_range,
                "experience_required": job.experience_required,
                "skills_required": job.skills_required,
                "application_deadline": job.application_deadline.isoformat() if job.application_deadline else None,
                "status": job.status,
                "created_at": job.created_at.isoformat()
            })

        return jsonify({
            "success": True,
            "data": output,
            "total": pagination.total,
            "pages": pagination.pages
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@job_bp.route("/<int:id>", methods=["GET"])
def get_single_job(id):
    try:
        job = Job.query.get_or_404(id)

        data = {
            "id": job.id,
            "job_id": job.job_id,
            "title": job.title,
            "description": job.description,
            "location": job.location,
            "employment_type": job.employment_type,
            "department": job.department,
            "salary_range": job.salary_range,
            "experience_required": job.experience_required,
            "skills_required": job.skills_required,
            "application_deadline": job.application_deadline.isoformat() if job.application_deadline else None,
            "status": job.status,
            "created_at": job.created_at.isoformat(),
            "updated_at": job.updated_at.isoformat()
        }

        return jsonify({"success": True, "data": data}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@job_bp.route("/", methods=["POST"])
@admin_required
def create_job():
    try:
        data = request.json

        deadline = None
        if data.get("application_deadline"):
            deadline = datetime.strptime(
                data.get("application_deadline"),
                "%Y-%m-%d"
            ).date()

        skills = data.get("skills_required",[])


        new_job = Job(
            job_id=data.get("job_id"),
            title=data.get("title"),
            description=data.get("description"),
            location=data.get("location"),
            employment_type=data.get("employment_type"),
            department=data.get("department"),
            salary_range=data.get("salary_range"),
            experience_required=data.get("experience_required"),
            skills_required = skills,
            application_deadline=deadline,
            status=data.get("status", "Open"),
            created_at=datetime.utcnow()
        )

        db.session.add(new_job)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Job created successfully"
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500