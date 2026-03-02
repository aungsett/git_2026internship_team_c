from app.models.job import Job
from app.extensions import db
from datetime import datetime


class JobService:

    @staticmethod
    def get_all_jobs(page=1, per_page=10):
        pagination = Job.query.order_by(
            Job.created_at.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)

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

        return {
            "data": output,
            "total": pagination.total,
            "pages": pagination.pages
        }
    
    @staticmethod
    def get_single_job(job_id):
        job = Job.query.get(job_id)

        if not job:
            raise ValueError("Job not found")

        return {
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
            "updated_at": job.updated_at.isoformat() if job.updated_at else None
        }
    
    @staticmethod
    def create_job(data):

        if not data.get("title"):
            raise ValueError("Job title is required")

        deadline = None
        if data.get("application_deadline"):
            deadline = datetime.strptime(
                data.get("application_deadline"),
                "%Y-%m-%d"
            ).date()

        new_job = Job(
            job_id=data.get("job_id"),
            title=data.get("title"),
            description=data.get("description"),
            location=data.get("location"),
            employment_type=data.get("employment_type"),
            department=data.get("department"),
            salary_range=data.get("salary_range"),
            experience_required=data.get("experience_required"),
            skills_required=data.get("skills_required", []),
            application_deadline=deadline,
            status=data.get("status", "Open"),
            created_at=datetime.utcnow()
        )

        db.session.add(new_job)
        db.session.commit()

        return True
    