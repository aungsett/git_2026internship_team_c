from app.models.admin import Admin
from app.models.applicant import Applicant
from app.models.review import ApplicationReview
from app.models.job import Job
from app.extensions import db
from app.services.email_service import EmailService
import csv
import io


class AdminService:

    @staticmethod
    def get_all_applications(page=1, per_page=10):
        pagination = ApplicationReview.query.order_by(
            ApplicationReview.reviewed_at.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)

        applications = pagination.items
        output = []

        for app in applications:
            output.append({
                "application_id": app.review_id,
                "applicant_id": app.applicant_id,
                "full_name": f"{app.applicant.first_name} {app.applicant.last_name}",
                "email": app.applicant.email,
                "job_id": app.job_id,
                "job_title": app.job.title,   
                "status": app.status,
                "comments": app.comments,
                "applied_at": app.reviewed_at.isoformat()
            })

        return {
            "data": output,
            "total": pagination.total,
            "pages": pagination.pages
        }

    @staticmethod
    def get_single_application(application_id):
        app = ApplicationReview.query.get(application_id)

        if not app:
            raise ValueError("Application not found")
        
        applicant = app.applicant

        doc_url = None
        if applicant.document:
            doc_url = applicant.document.document_url

        data = {
            "application_id": app.review_id,
            "applicant_id": applicant.applicant_id,
            "full_name": f"{applicant.first_name} {applicant.last_name}",
            "email": applicant.email,
            "job_id": app.job_id,
            "job_title": app.job.title,
            "status": app.status,
            "comments": app.comments,
            "reviewed_at": app.reviewed_at.isoformat(),
            "document_url": doc_url
        }
        return data
    
    @staticmethod
    def review_application(applicant_id, job_id, status, comments, admin_id):

        if not status or not admin_id or not job_id_id:
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
        review.comments = comments
        review.admin_id = admin_id

        db.session.commit()

        applicant=review.applicant

        # Send email when status is updated
        EmailService.send_status_update_email(
            applicant.email,
            applicant.first_name,
            status
        )

        return True

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

        # Update fields only if provided
        if data.get("title"):
            job.title = data.get("title")

        if data.get("description"):
            job.description = data.get("description")

        if data.get("location"):
            job.location = data.get("location")

        if data.get("salary"):
            job.salary = data.get("salary")

        #Handle draft/published
        if data.get("status"):
            if data.get("status") not in ["draft", "published"]:
                raise ValueError("Invalid status")
            job.status = data.get("status")

        db.session.commit()

        return job