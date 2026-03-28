from app.models.job import Job
from app.extensions import db
from datetime import datetime
from sqlalchemy.exc import IntegrityError


class JobService:

    @staticmethod
    def get_all_jobs():
        pagination = Job.query.filter_by(status="Published").order_by(
            Job.created_at.desc()
        ).paginate(error_out=False)

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
                "description":job.description,
                "salary_range": job.salary_range,
                "experience_required": job.experience_required,
                "skills": job.skills,
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
        job = Job.query.filter_by(job_id=job_id).first()

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
            "skills": job.skills,
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

        experience_required = data.get("experience_required")
        if experience_required in ("", None):
            experience_required = None
        elif isinstance(experience_required, str):
            if not experience_required.strip().isdigit():
                raise ValueError(
                    "Experience must be a whole number of years (example: 0, 1, 5)."
                )
            experience_required = int(experience_required.strip())

        new_job = Job(
            job_id=data.get("job_id"),
            title=data.get("title"),
            description=data.get("description"),
            location=data.get("location"),
            employment_type=data.get("employment_type"),
            department=data.get("department"),
            salary_range=data.get("salary_range"),
            experience_required=experience_required,
            skills=data.get("skills", []),
            application_deadline=deadline,
            status=data.get("status", "Open"),
            created_at=datetime.utcnow()
        )

        db.session.add(new_job)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            # Most common: duplicate business job_id (unique constraint).
            raise ValueError("Job ID already exists. Please use a different Job ID.")

        return True

    @staticmethod
    def delete_job(job_id):
        job = Job.query.get(job_id)
    
        if not job:
            raise ValueError("Job not found")
    
        # Delete related application reviews first
        from app.models.review import ApplicationReview
        ApplicationReview.query.filter_by(job_id=job_id).delete()
    
        db.session.delete(job)
        db.session.commit()
    
        return True
