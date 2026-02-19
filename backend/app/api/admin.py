from flask import Blueprint, request, jsonify, Response
from app.extensions import db
from app.models.applicant import Applicant
from app.models.review import ApplicationReview
from app.models.document import Document
from app.utils.decorators import admin_required
import csv
import io

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")
@admin_required
@admin_bp.route("/applications", methods=["GET"])
def get_all_applications():
    try:
        # Basic Pagination
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Query Applicants
        pagination = Applicant.query.order_by(Applicant.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
        applicants = pagination.items

        output = []
        for app in applicants:
            # Check if review exists
            status = "Pending"
            if app.reviews:
                # Assuming 1 review per admin logic, or taking the latest
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

        return jsonify({
            "success": True,
            "data": output,
            "total": pagination.total,
            "pages": pagination.pages
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@admin_bp.route("/applications/<int:id>", methods=["GET"])
def get_single_application(id):
    try:
        app = Applicant.query.get_or_404(id)
        
        # Get Document URL
        doc_url = app.document.document_url if app.document else None
        
        # Get Review Data
        review_data = {}
        if app.reviews:
            latest_review = app.reviews[0]
            review_data = {
                "status": latest_review.status,
                "comments": latest_review.comments,
                "reviewed_at": latest_review.reviewed_at.isoformat()
            }

        data = app.to_dict() # Uses the helper we made in models
        data["document_url"] = doc_url
        data["review"] = review_data

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

        # Check if review exists
        review = ApplicationReview.query.filter_by(applicant_id=id).first()

        if review:
            review.status = status
            review.comments = comments
        else:
            # Create new review
            review = ApplicationReview(
                applicant_id=id,
                admin_id=admin_id,
                status=status,
                comments=comments
            )
            db.session.add(review)

        db.session.commit()
        return jsonify({"success": True, "message": "Status updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@admin_bp.route("/export", methods=["GET"])
def export_csv():
    try:
        # Get all applicants
        applicants = Applicant.query.all()

        # Create CSV in memory
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Headers
        writer.writerow(["ID", "Name", "Email", "Phone", "Qualification", "Experience", "Summary"])

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

        # Return as downloadable file
        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-Disposition": "attachment;filename=applicants_export.csv"}
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500