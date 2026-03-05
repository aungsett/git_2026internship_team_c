from app.models.admin import Admin
from app.models.applicant import Applicant
from app.models.review import ApplicationReview
from app.extensions import db
import csv
import io

class AdminService:

    @staticmethod
    def get_all_applications(page=1, per_page=10):
        pagination = Applicant.query.order_by(
            Applicant.created_at.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)

        applicants = pagination.items
        output = []

        for app in applicants:
            status = "Pending"
            if app.reviews:
                status = app.reviews[0].status

            output.append({
                "id": app.applicant_id,
                "full_name": f"{app.first_name} {app.last_name}",
                "email": app.email,
                "qualification": app.qualification,
                "work_experience": app.work_experience,
                "status": status,
                "created_at": app.created_at.isoformat()
            })

        return {
            "data": output,
            "total": pagination.total,
            "pages": pagination.pages
        }
    
    @staticmethod
    def get_single_application(applicant_id):
        app = Applicant.query.get(applicant_id)
            
        if not app:
            raise ValueError("Application not found")
            
        doc_url = app.document.document_url if app.document else None
            
        review_data = {}
            
        if app.reviews:
            latest_review = app.reviews[0]
            review_data = {
                "status": latest_review.status,
                "comments": latest_review.comments,
                "reviewed_at": latest_review.reviewed_at.isoformat()
            }
                
        data = app.to_dict()
        data["document_url"] = doc_url
        data["review"] = review_data
            
        return data
        

    @staticmethod
    def review_application(applicant_id, status, comments, admin_id):
    
        if not status or not admin_id:
            raise ValueError("Status and Admin ID required")
    
        admin = Admin.query.get(admin_id)
        if not admin:
            raise ValueError("Admin not found")
    
        review = ApplicationReview.query.filter_by(
            applicant_id=applicant_id
        ).first()
    
        if review:
            review.status = status
            review.comments = comments
        else:
            review = ApplicationReview(
                applicant_id=applicant_id,
                admin_id=admin_id,
                status=status,
                comments=comments
            )
            db.session.add(review)
    
        db.session.commit()
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
    
