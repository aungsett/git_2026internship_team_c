import pytest
from sqlalchemy.exc import IntegrityError
from app.extensions import db
from app.models.applicant import Applicant


# 1. Test Applicant Creation
def test_create_applicant(app):
    applicant = Applicant(
        first_name="John",
        last_name="Doe",
        email="john@example.com"
    )

    db.session.add(applicant)
    db.session.commit()

    saved = Applicant.query.filter_by(email="john@example.com").first()

    assert saved is not None
    assert saved.first_name == "John"


# 2. Test Required Fields (email required)
def test_email_required(app):
    applicant = Applicant(
        first_name="Jane",
        last_name="Doe",
        email=None
    )

    db.session.add(applicant)

    with pytest.raises(IntegrityError):
        db.session.commit()

    db.session.rollback()


# 3. Test Unique Email Constraint
def test_unique_email(app):
    applicant1 = Applicant(
        first_name="A",
        last_name="B",
        email="unique@example.com"
    )

    applicant2 = Applicant(
        first_name="C",
        last_name="D",
        email="unique@example.com"
    )

    db.session.add(applicant1)
    db.session.commit()

    db.session.add(applicant2)

    with pytest.raises(IntegrityError):
        db.session.commit()

    db.session.rollback()


# 4. Test to_dict() Method
def test_to_dict(app):
    applicant = Applicant(
        first_name="Test",
        last_name="User",
        email="dict@example.com",
        phone_number="1234567890"
    )

    db.session.add(applicant)
    db.session.commit()

    result = applicant.to_dict()

    assert result["email"] == "dict@example.com"
    assert result["first_name"] == "Test"
    assert "created_at" in result


# 5. Test __repr__
def test_repr(app):
    applicant = Applicant(
        first_name="Repr",
        last_name="User",
        email="repr@example.com"
    )

    assert "<Applicant repr@example.com>" == repr(applicant)