import pytest
from sqlalchemy.exc import IntegrityError
from app.extensions import db
from app.models.applicant import Applicant
from app.models.document import Document


# Helper: Create Applicant First
def create_applicant():
    applicant = Applicant(
        first_name="Doc",
        last_name="User",
        email="docuser@example.com"
    )
    db.session.add(applicant)
    db.session.commit()
    return applicant


# 1. Test Document Creation
def test_create_document(app):
    applicant = create_applicant()

    document = Document(
        applicant_id=applicant.applicant_id,
        file_name="resume.pdf",
        file_type="pdf",
        document_url="https://cloudinary.com/resume.pdf"
    )

    db.session.add(document)
    db.session.commit()

    saved = Document.query.first()

    assert saved is not None
    assert saved.file_name == "resume.pdf"


# 2. Test document_url Required
def test_document_url_required(app):
    applicant = create_applicant()

    document = Document(
        applicant_id=applicant.applicant_id,
        file_name="resume.pdf",
        file_type="pdf",
        document_url=None
    )

    db.session.add(document)

    with pytest.raises(IntegrityError):
        db.session.commit()

    db.session.rollback()


# 3. Test One-to-One Constraint (unique applicant_id)
def test_one_document_per_applicant(app):
    applicant = create_applicant()

    doc1 = Document(
        applicant_id=applicant.applicant_id,
        document_url="https://cloudinary.com/doc1.pdf"
    )

    doc2 = Document(
        applicant_id=applicant.applicant_id,
        document_url="https://cloudinary.com/doc2.pdf"
    )

    db.session.add(doc1)
    db.session.commit()

    db.session.add(doc2)

    with pytest.raises(IntegrityError):
        db.session.commit()

    db.session.rollback()


# 4. Test Foreign Key Constraint
def test_foreign_key_constraint(app):
    document = Document(
        applicant_id=9999,  # non-existing applicant
        document_url="https://cloudinary.com/test.pdf"
    )

    db.session.add(document)

    with pytest.raises(IntegrityError):
        db.session.commit()

    db.session.rollback()


# 5. Test Default uploaded_at
def test_uploaded_at_default(app):
    applicant = create_applicant()

    document = Document(
        applicant_id=applicant.applicant_id,
        document_url="https://cloudinary.com/time.pdf"
    )

    db.session.add(document)
    db.session.commit()

    assert document.uploaded_at is not None