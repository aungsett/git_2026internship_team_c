from datetime import datetime
from app.extensions import db
from app.models.applicant import Applicant
from app.models.review import ApplicationReview
from app.models.document import Document
from app.models.admin import Admin


class AdminService:

    ALLOWED_STATUSES = ["Pending", "Shortlisted", "Rejected"]

    @staticmethod
    def get_all_applications(page, per_page):
        pagination = Applicant.query.order_by(
            Applicant.created_at.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)

        applicants = pagination.items
        output = []

        for app in applicants:
            review = app.reviews[0] if app.reviews else None
            status = review.status if review else "Pending"

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
        app = Applicant.query.get_or_404(applicant_id)

        doc_url = app.document.document_url if app.document else None

        review = app.reviews[0] if app.reviews else None

        review_data = {}
        if review:
            review_data = {
                "status": review.status,
                "comments": review.comments,
                "reviewed_at": review.reviewed_at.isoformat()
            }

        data = app.to_dict()
        data["document_url"] = doc_url
        data["review"] = review_data

        return data

    @staticmethod
    def review_application(applicant_id, status, comments, admin_id):

        # ✅ Validate status
        if status not in AdminService.ALLOWED_STATUSES:
            raise ValueError("Invalid status value")

        # ✅ Validate applicant exists
        applicant = Applicant.query.get_or_404(applicant_id)

        # ✅ Validate admin exists
        admin = Admin.query.get_or_404(admin_id)

        review = ApplicationReview.query.filter_by(
            applicant_id=applicant_id
        ).first()

        if review:
            review.status = status
            review.comments = comments
            review.admin_id = admin_id
            review.reviewed_at = datetime.utcnow()
        else:
            review = ApplicationReview(
                applicant_id=applicant_id,
                admin_id=admin_id,
                status=status,
                comments=comments
            )
            db.session.add(review)

        db.session.commit()