import pytest
from sqlalchemy.exc import IntegrityError
from app.extensions import db
from app.models.admin import Admin
from app.models.applicant import Applicant
from app.models.review import ApplicationReview


# Helper: Create Admin
def create_admin():
    admin = Admin(
        firebase_uid="review_admin_uid",
        username="reviewadmin",
        email="reviewadmin@example.com",
        role="admin"
    )
    db.session.add(admin)
    db.session.commit()
    return admin


# Helper: Create Applicant
def create_applicant():
    applicant = Applicant(
        first_name="Review",
        last_name="User",
        email="reviewuser@example.com"
    )
    db.session.add(applicant)
    db.session.commit()
    return applicant


# Test Review Creation
def test_create_review(app):
    admin = create_admin()
    applicant = create_applicant()

    review = ApplicationReview(
        applicant_id=applicant.applicant_id,
        admin_id=admin.admin_id,
        comments="Good candidate"
    )

    db.session.add(review)
    db.session.commit()

    saved = ApplicationReview.query.first()

    assert saved is not None
    assert saved.comments == "Good candidate"


# Test Default Status
def test_default_status(app):
    admin = create_admin()
    applicant = create_applicant()

    review = ApplicationReview(
        applicant_id=applicant.applicant_id,
        admin_id=admin.admin_id
    )

    db.session.add(review)
    db.session.commit()

    assert review.status == "Pending"


#3. Test Invalid Applicant FK
def test_invalid_applicant_fk(app):
    admin = create_admin()

    review = ApplicationReview(
        applicant_id=9999,  # Non-existing
        admin_id=admin.admin_id
    )

    db.session.add(review)

    with pytest.raises(IntegrityError):
        db.session.commit()

    db.session.rollback()


# 4. Test Invalid Admin FK
def test_invalid_admin_fk(app):
    applicant = create_applicant()

    review = ApplicationReview(
        applicant_id=applicant.applicant_id,
        admin_id=9999  # Non-existing
    )

    db.session.add(review)

    with pytest.raises(IntegrityError):
        db.session.commit()

    db.session.rollback()


# 5. Test reviewed_at Default
def test_reviewed_at_default(app):
    admin = create_admin()
    applicant = create_applicant()

    review = ApplicationReview(
        applicant_id=applicant.applicant_id,
        admin_id=admin.admin_id
    )

    db.session.add(review)
    db.session.commit()

    assert review.reviewed_at is not None