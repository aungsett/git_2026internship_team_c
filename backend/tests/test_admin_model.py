import pytest 
from sqlalchemy.exc import IntegrityError
from app.extensions import db
from app.models.admin import Admin


# 1. Test Admin Creation
def test_create_admin(app):
    admin = Admin(
        firebase_uid="uid_123",
        username="testuser",
        email="test@example.com"
    )

    db.session.add(admin)
    db.session.commit()

    saved_admin = Admin.query.filter_by(email="test@example.com").first()

    assert saved_admin is not None
    assert saved_admin.username == "testuser"


# 2. Test Default Role
def test_default_role(app):
    admin = Admin(
        firebase_uid="uid_456",
        username="user2",
        email="user2@example.com"
    )

    db.session.add(admin)
    db.session.commit()

    assert admin.role == "admin"


# 3. Test Duplicate Email Fails
def test_duplicate_email(app):
    admin1 = Admin(
        firebase_uid="uid_789",
        username="user3",
        email="duplicate@example.com"
    )

    admin2 = Admin(
        firebase_uid="uid_999",
        username="user4",
        email="duplicate@example.com"
    )

    db.session.add(admin1)
    db.session.commit()

    db.session.add(admin2)

    with pytest.raises(IntegrityError):
        db.session.commit()

    db.session.rollback()


# 4. Test Duplicate Firebase UID Fails
def test_duplicate_firebase_uid(app):
    admin1 = Admin(
        firebase_uid="same_uid",
        username="user5",
        email="user5@example.com"
    )

    admin2 = Admin(
        firebase_uid="same_uid",
        username="user6",
        email="user6@example.com"
    )

    db.session.add(admin1)
    db.session.commit()

    db.session.add(admin2)

    with pytest.raises(IntegrityError):
        db.session.commit()

    db.session.rollback()


# 5. Test Nullable Fields (firebase_uid required)
def test_firebase_uid_required(app):
    admin = Admin(
        firebase_uid=None,
        username="user7",
        email="user7@example.com"
    )

    db.session.add(admin)

    with pytest.raises(IntegrityError):
        db.session.commit()

    db.session.rollback()