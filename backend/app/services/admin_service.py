from app.models.admin import Admin
from app.models.applicant import Applicant
from app.models.review import ApplicationReview
from app.models.job import Job
from app.extensions import db
from app.services.email_service import EmailService
import csv
import io
from sqlalchemy import func


class AdminService:

    @staticmethod
    def get_all_applications():
        pagination = ApplicationReview.query.order_by(
            ApplicationReview.reviewed_at.desc()
        ).paginate(error_out=False)

        applications = pagination.items
        output = []

        for app in applications:
            applicant = app.applicant

            output.append({
                "id": app.review_id,
                "full_name": f"{applicant.first_name} {applicant.last_name}",
                "email": applicant.email,
                "phone_number": applicant.phone_number,
                "qualification": applicant.qualification,
                "work_experience": applicant.work_experience,
                "preferred_japanese_course": applicant.preferred_japanese_course,
                "job_id": app.job_id,
                "job_title": app.job.title,
                "status": app.status,
                "created_at": applicant.created_at.isoformat(),
            })

        return {
            "data": output,
            "total": pagination.total,
            "pages": pagination.pages
        }

    @staticmethod
    def get_single_application(application_id):
        app = ApplicationReview.query.filter_by(review_id=application_id).first()

        if not app:
            raise ValueError("Application not found")
        
        applicant = app.applicant

        doc_url = app.document.document_url if app.document else None

        data = {
            "applicant_id": applicant.applicant_id,
            "review_id": app.review_id,
            "first_name": applicant.first_name,
            "last_name": applicant.last_name,
            "email": applicant.email,
            "phone_number": applicant.phone_number,
            "skills": applicant.skills,
            "created_at": applicant.created_at.isoformat(),
            "date_of_birth": applicant.date_of_birth,
            "work_experience": applicant.work_experience,
            "qualification": applicant.qualification,
            "address": applicant.address,
            "college": applicant.college,
            "status": app.status,
            "preferred_japanese_course": applicant.preferred_japanese_course,
            "language": applicant.language,
            "social_links": applicant.social_links,
            "document_url": doc_url,
            "job_id": app.job_id,
            "job_title": app.job.title,
            "professional_summary": applicant.professional_summary,
            "comments": applicant.comments,
            "review": {
                "application_id": app.review_id,
                "comments": app.comments,
                "reviewed_at": app.reviewed_at.isoformat(),
                "admin_id": app.admin_id
            }
        }
        return data
    
    @staticmethod
    def review_application(applicant_id, job_id, status, admin_id):

        if not status or not admin_id or not job_id:
            raise ValueError("Status, Job ID and Admin ID required")

        admin = Admin.query.get(admin_id)
        if not admin:
            raise ValueError("Admin not found")

        applicant = Applicant.query.get(applicant_id)
        if not applicant:
            raise ValueError("Applicant not found")

        review = ApplicationReview.query.filter_by(
            applicant_id=applicant_id,
            job_id=job_id
        ).first()


        if not review:
            raise ValueError("Application not found")

        
        review.status = status
        review.admin_id = admin_id

        db.session.commit()

        applicant=review.applicant

        # Send email when status is updated
        EmailService.send_status_update_email(
            applicant.email,
            applicant.first_name,
            status,
            review.job.title,
            review.job_id
        )

        return True

    @staticmethod
    def get_all_jobs():
        pagination = Job.query.order_by(
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
    def export_applicants_csv():
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

        return output.getvalue()
    
    @staticmethod
    def update_job(job_id, data):
        job = Job.query.get(job_id)

        if not job:
            raise ValueError("Job not found")

        if data.get("title"):
            job.title = data["title"]
        if data.get("description"):
            job.description = data["description"]
        if data.get("location"):
            job.location = data["location"]
        if data.get("salary_range"):
            job.salary_range = data["salary_range"]
        if data.get("employment_type"):
            job.employment_type = data["employment_type"]
        if data.get("department"):
            job.department = data["department"]
        if "experience_required" in data and data["experience_required"] is not None:
            job.experience_required = int(data["experience_required"])
        if data.get("skills") is not None:
            job.skills = data["skills"]
        if data.get("application_deadline"):
            from datetime import datetime
            job.application_deadline = datetime.strptime(data["application_deadline"], "%Y-%m-%d").date()
        if data.get("status"):
            if data["status"].lower() not in ["draft", "published", "closed"]:
                raise ValueError("Invalid status")
            job.status = data["status"].lower()

        job.updated_at = datetime.utcnow()
        db.session.commit()

        return job

    @staticmethod
    def get_admin_stats():
        # 1️⃣ Total Applicants
        total_applicants = db.session.query(func.count(Applicant.applicant_id)).scalar()

        # 2️⃣ Status Counts (Single Query)
        status_counts_query = (
            db.session.query(
                ApplicationReview.status,
                func.count(ApplicationReview.review_id)
            )
            .group_by(ApplicationReview.status)
            .all()
        )

        status_counts = {
            "Pending": 0,
            "Shortlisted": 0,
            "Rejected": 0,
            "Interviewed": 0,
        }

        for status, count in status_counts_query:
            status_counts[status] = count

        # 3️⃣ Applications Over Time (Daily)
        applications_over_time = (
            db.session.query(
                func.date(ApplicationReview.reviewed_at).label("date"),
                func.count(ApplicationReview.review_id)
            )
            .group_by(func.date(ApplicationReview.reviewed_at))
            .order_by(func.date(ApplicationReview.reviewed_at))
            .all()
        )

        applications_over_time_data = [
            {"date": str(date), "count": count}
            for date, count in applications_over_time
        ]

        # 4️⃣ Drop-off Funnel (Where users leave)
        drop_off_query = (
            db.session.query(
                ApplicationReview.status,
                func.count(ApplicationReview.review_id)
            )
            .group_by(ApplicationReview.status)
            .all()
        )

        # Ordered funnel
        funnel_order = ["Pending", "Interviewed", "Shortlisted", "Rejected"]

        drop_off_map = {status: count for status, count in drop_off_query}

        drop_off_funnel = [
            {"stage": stage, "count": drop_off_map.get(stage, 0)}
            for stage in funnel_order
        ]

        # 5️⃣ Conversion Funnel (Progression)
        # Same data, just logical interpretation for UI
        conversion_funnel = [
            {"stage": "Applied", "count": total_applicants},
            {"stage": "Pending", "count": drop_off_map.get("Pending", 0)},
            {"stage": "Interviewed", "count": drop_off_map.get("Interviewed", 0)},
            {"stage": "Shortlisted", "count": drop_off_map.get("Shortlisted", 0)},
        ]

        return {
            "totalApplicants": total_applicants,
            "statusCounts": status_counts,
            "applicationsOverTime": applications_over_time_data,
            "dropOffFunnel": drop_off_funnel,
            "conversionFunnel": conversion_funnel,
        }