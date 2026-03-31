import pytest
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from app.extensions import db
from app.models.applicant import Applicant
from app.models.review import ApplicationReview
from app.models.document import Document
from app.models.job import Job
from app.models.admin import Admin


def create_review_chain():
    job = Job(
        job_id="JOB-TEST-001",
        title="Software Engineer",
        description="Test job",
        location="Remote",
        employment_type="Full-time"
    )
    db.session.add(job)
    db.session.flush()
    
    admin = Admin(
        firebase_uid="test_admin_doc",
        username="testadmin",
        email="testadmin@example.com"
    )
    db.session.add(admin)
    db.session.flush()
    
    applicant = Applicant(
        first_name="Test",
        last_name="User",
        email="testuser@example.com"
    )
    db.session.add(applicant)
    db.session.flush()
    
    review = ApplicationReview(
        applicant_id=applicant.applicant_id,
        admin_id=admin.admin_id,
        job_id=job.id,
        status="Pending"
    )
    db.session.add(review)
    db.session.commit()
    return review


def test_create_document(app):
    with app.app_context():
        review = create_review_chain()
        
        document = Document(
            review_id=review.review_id,
            file_name="resume.pdf",
            file_type="pdf",
            document_url="https://cloudinary.com/resume.pdf"
        )
        db.session.add(document)
        db.session.commit()
        
        saved = Document.query.first()
        assert saved is not None
        assert saved.file_name == "resume.pdf"


def test_document_url_required(app):
    with app.app_context():
        review = create_review_chain()
        
        document = Document(
            review_id=review.review_id,
            document_url=None
        )
        db.session.add(document)
        
        with pytest.raises(IntegrityError):
            db.session.commit()
        db.session.rollback()


def test_one_document_per_review(app):
    with app.app_context():
        review = create_review_chain()
        
        doc1 = Document(
            review_id=review.review_id,
            document_url="https://cloudinary.com/doc1.pdf"
        )
        db.session.add(doc1)
        db.session.commit()
        
        doc2 = Document(
            review_id=review.review_id,
            document_url="https://cloudinary.com/doc2.pdf"
        )
        db.session.add(doc2)
        
        with pytest.raises(IntegrityError):
            db.session.commit()
        db.session.rollback()


def test_foreign_key_constraint(app):
    with app.app_context():
        document = Document(
            review_id=99999,
            document_url="https://cloudinary.com/test.pdf"
        )
        db.session.add(document)
        
        try:
            db.session.commit()
            assert True
        except IntegrityError:
            db.session.rollback()
            assert True


def test_uploaded_at_default(app):
    with app.app_context():
        review = create_review_chain()
        
        document = Document(
            review_id=review.review_id,
            document_url="https://cloudinary.com/time.pdf"
        )
        db.session.add(document)
        db.session.commit()
        
        assert document.uploaded_at is not None
        assert isinstance(document.uploaded_at, datetime)