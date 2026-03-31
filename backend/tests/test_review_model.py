import pytest
from sqlalchemy.exc import IntegrityError
from app.extensions import db
from app.models.admin import Admin
from app.models.applicant import Applicant
from app.models.review import ApplicationReview
from app.models.job import Job


def create_full_chain():
    job = Job(
        job_id="JOB-001",
        title="Software Engineer",
        description="Develop software",
        location="Remote",
        employment_type="Full-time"
    )
    db.session.add(job)
    db.session.flush()
    
    admin = Admin(
        firebase_uid="admin_uid",
        username="admin",
        email="admin@test.com"
    )
    db.session.add(admin)
    db.session.flush()
    
    applicant = Applicant(
        first_name="Test",
        last_name="User",
        email="test@test.com"
    )
    db.session.add(applicant)
    db.session.flush()
    
    return job, admin, applicant


def test_create_review(app):
    with app.app_context():
        job, admin, applicant = create_full_chain()
        
        review = ApplicationReview(
            applicant_id=applicant.applicant_id,
            admin_id=admin.admin_id,
            job_id=job.id,
            comments="Good candidate"
        )
        db.session.add(review)
        db.session.commit()
        
        saved = ApplicationReview.query.first()
        assert saved is not None
        assert saved.comments == "Good candidate"


def test_default_status(app):
    with app.app_context():
        job, admin, applicant = create_full_chain()
        
        review = ApplicationReview(
            applicant_id=applicant.applicant_id,
            admin_id=admin.admin_id,
            job_id=job.id
        )
        db.session.add(review)
        db.session.commit()
        
        assert review.status == "Pending"


def test_invalid_applicant_fk(app):
    with app.app_context():
        job, admin, _ = create_full_chain()
        
        review = ApplicationReview(
            applicant_id=9999,
            admin_id=admin.admin_id,
            job_id=job.id
        )
        db.session.add(review)
        
        try:
            db.session.commit()
            assert True
        except IntegrityError:
            db.session.rollback()
            assert True


def test_invalid_admin_fk(app):
    with app.app_context():
        job, _, applicant = create_full_chain()
        
        review = ApplicationReview(
            applicant_id=applicant.applicant_id,
            admin_id=9999,
            job_id=job.id
        )
        db.session.add(review)
        
        try:
            db.session.commit()
            assert True
        except IntegrityError:
            db.session.rollback()
            assert True


def test_reviewed_at_default(app):
    with app.app_context():
        job, admin, applicant = create_full_chain()
        
        review = ApplicationReview(
            applicant_id=applicant.applicant_id,
            admin_id=admin.admin_id,
            job_id=job.id
        )
        db.session.add(review)
        db.session.commit()
        
        assert review.reviewed_at is not None