import pytest
from app.services.applicant_service import ApplicantService
from app.models.applicant import Applicant
from app.extensions import db


def test_create_applicant_success(app):

    data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@test.com"
    }

    applicant = ApplicantService.create_applicant(data)

    assert applicant.email == "john@test.com"
    assert applicant.first_name == "John"


def test_create_applicant_duplicate_email(app):

    data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "duplicate@test.com"
    }

    # First creation
    ApplicantService.create_applicant(data)

    # Second should fail
    with pytest.raises(ValueError):
        ApplicantService.create_applicant(data)