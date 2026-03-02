# tests/test_applicant_full.py
import io
import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime
from app.models.applicant import Applicant
from app.models.document import Document
from app.services.applicant_service import ApplicantService
import app.utils.decorators as decorators

# -----------------------------
# MOCK APPLICANT REQUIRED DECORATOR
# -----------------------------
@pytest.fixture(autouse=True)
def mock_applicant_required(monkeypatch):
    # replace applicant_required decorator with a no-op for testing
    monkeypatch.setattr(decorators, "applicant_required", lambda f: f)

# -----------------------------
# HELPERS
# -----------------------------
def make_file(filename="cv.pdf", content=b"dummy pdf"):
    file = MagicMock()
    file.filename = filename
    file.read.return_value = content
    return file

def make_applicant(id=1, first_name="John", last_name="Doe", email="john@example.com", dob=None):
    app = MagicMock(spec=Applicant)
    app.applicant_id = id
    app.first_name = first_name
    app.last_name = last_name
    app.email = email
    app.date_of_birth = dob
    app.qualification = "B.Tech"
    app.preferred_japanese_course = "N5"
    app.created_at = datetime(2023, 1, 1)
    app.to_dict.return_value = {
        "applicant_id": id,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "qualification": "B.Tech",
        "preferred_japanese_course": "N5",
        "created_at": datetime(2023, 1, 1)
    }
    return app

# -----------------------------
# APPLICANT SERVICE TESTS
# -----------------------------
def test_submit_application_success(app):
    with app.app_context():
        data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "date_of_birth": "2000-01-01",
            "qualification": "B.Tech",
            "preferred_course": "N5"
        }
        file = make_file()

        with patch("app.services.applicant_service.upload_cv") as mock_upload:
            mock_upload.return_value = "http://cloudinary.com/cv.pdf"

            applicant = ApplicantService.submit_application(data, file)
            assert applicant is not None
            assert applicant.first_name == "John"

def test_missing_required_field(app):
    with app.app_context():
        data = {"last_name": "Doe", "email": "john@example.com"}
        file = make_file()

        with pytest.raises(ValueError) as exc:
            ApplicantService.submit_application(data, file)
        assert "first_name is required" in str(exc.value)

def test_invalid_email(app):
    with app.app_context():
        data = {"first_name": "John", "last_name": "Doe", "email": "invalid-email"}
        file = make_file()

        with pytest.raises(ValueError) as exc:
            ApplicantService.submit_application(data, file)
        assert "Invalid email format" in str(exc.value)

def test_duplicate_email(app):
    with app.app_context():
        # simulate existing applicant
        existing = make_applicant()
        from app.extensions import db
        db.session.add(existing)
        db.session.commit()

        data = {"first_name": "Jane", "last_name": "Smith", "email": "john@example.com"}
        file = make_file()

        with pytest.raises(ValueError) as exc:
            ApplicantService.submit_application(data, file)
        assert "Email already exists" in str(exc.value)

def test_invalid_file_type(app):
    with app.app_context():
        data = {"first_name": "John", "last_name": "Doe", "email": "john@example.com"}
        file = make_file(filename="cv.jpg")

        with pytest.raises(ValueError) as exc:
            ApplicantService.submit_application(data, file)
        assert "Only PDF files are allowed" in str(exc.value)

# -----------------------------
# APPLICANT API TESTS
# -----------------------------
def test_submit_application_api(client):
    data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "date_of_birth": "2000-01-01",
        "qualification": "B.Tech",
        "preferred_course": "N5"
    }
    file_content = io.BytesIO(b"dummy pdf")
    file_content.name = "cv.pdf"

    with patch("app.services.applicant_service.ApplicantService.submit_application") as mock_service:
        mock_service.return_value = make_applicant()

        response = client.post(
            "/applicant/submit",
            data={**data, "file": (file_content, "cv.pdf")},
            content_type="multipart/form-data"
        )

        json_data = response.get_json()
        assert response.status_code == 201
        assert json_data["success"] is True
        assert "applicant_id" in json_data

def test_submit_application_api_missing_field(client):
    data = {"last_name": "Doe"}  # missing first_name
    file_content = io.BytesIO(b"dummy pdf")
    file_content.name = "cv.pdf"

    response = client.post(
        "/applicant/submit",
        data={**data, "file": (file_content, "cv.pdf")},
        content_type="multipart/form-data"
    )
    json_data = response.get_json()
    assert response.status_code == 400
    assert "first_name is required" in json_data["error"]

def test_submit_application_api_invalid_file(client):
    data = {"first_name": "John", "last_name": "Doe", "email": "john@example.com"}
    file_content = io.BytesIO(b"dummy jpg")
    file_content.name = "cv.jpg"

    response = client.post(
        "/applicant/submit",
        data={**data, "file": (file_content, "cv.jpg")},
        content_type="multipart/form-data"
    )
    json_data = response.get_json()
    assert response.status_code == 400
    assert "Only PDF files are allowed" in json_data["error"]