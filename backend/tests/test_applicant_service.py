# tests/test_applicant_service.py
import io
import pytest
from unittest.mock import patch
from werkzeug.datastructures import FileStorage
from app.services.applicant_service import ApplicantService
from app.models.applicant import Applicant
from app.extensions import db


def make_file(filename="cv.pdf", content=b"dummy pdf content"):
    """Helper to create a FileStorage object for tests."""
    return FileStorage(
        stream=io.BytesIO(content),
        filename=filename,
        content_type="application/pdf"
    )


def test_submit_application_success(app):
    data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john_success@example.com",
        "date_of_birth": "2000-01-01",
        "qualification": "B.Tech",
        "preferred_course": "N5"
    }

    file = make_file("cv.pdf")

    with patch("app.services.applicant_service.upload_cv") as mock_upload:
        mock_upload.return_value = "http://cloudinary.com/cv.pdf"

        applicant = ApplicantService.submit_application(data, file)
        saved = Applicant.query.filter_by(email="john_success@example.com").first()

        assert applicant is not None
        assert saved is not None
        assert saved.first_name == "John"


def test_missing_required_field(app):
    data = {
        "last_name": "Doe",
        "email": "john_missing@example.com"
    }
    file = make_file("cv.pdf")

    with patch("app.services.applicant_service.upload_cv") as mock_upload:
        mock_upload.return_value = "http://cloudinary.com/cv.pdf"

        with pytest.raises(ValueError) as exc:
            ApplicantService.submit_application(data, file)

    assert "first_name is required" in str(exc.value)


def test_invalid_email(app):
    data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "invalid-email"
    }
    file = make_file("cv.pdf")

    with patch("app.services.applicant_service.upload_cv") as mock_upload:
        mock_upload.return_value = "http://cloudinary.com/cv.pdf"

        with pytest.raises(ValueError) as exc:
            ApplicantService.submit_application(data, file)

    assert "Invalid email format" in str(exc.value)


def test_duplicate_email(app):
    # Create existing applicant
    existing = Applicant(
        first_name="John",
        last_name="Doe",
        email="john_duplicate@example.com"
    )
    db.session.add(existing)
    db.session.commit()

    data = {
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "john_duplicate@example.com"
    }
    file = make_file("cv.pdf")

    with patch("app.services.applicant_service.upload_cv") as mock_upload:
        mock_upload.return_value = "http://cloudinary.com/cv.pdf"

        with pytest.raises(ValueError) as exc:
            ApplicantService.submit_application(data, file)

    assert "Email already exists" in str(exc.value)


def test_invalid_file_type(app):
    data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john_filetype@example.com"
    }
    file = make_file("cv.jpg")  # invalid type

    with patch("app.services.applicant_service.upload_cv") as mock_upload:
        mock_upload.return_value = "http://cloudinary.com/cv.pdf"

        with pytest.raises(ValueError) as exc:
            ApplicantService.submit_application(data, file)

    assert "Only PDF files are allowed" in str(exc.value)


def test_underage_applicant(app):
    data = {
        "first_name": "Young",
        "last_name": "User",
        "email": "young_user@example.com",
        "date_of_birth": "2010-01-01"
    }
    file = make_file("cv.pdf")

    with patch("app.services.applicant_service.upload_cv") as mock_upload:
        mock_upload.return_value = "http://cloudinary.com/cv.pdf"

        with pytest.raises(ValueError) as exc:
            ApplicantService.submit_application(data, file)

    assert "at least 18 years old" in str(exc.value)