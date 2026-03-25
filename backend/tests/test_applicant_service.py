import io
from unittest.mock import patch, MagicMock


# ------------------------
# SUBMIT APPLICATION
# ------------------------

@patch("app.api.applicant.ApplicantService")
def test_submit_application_success(mock_service, client):

    mock_applicant = MagicMock()
    mock_applicant.applicant_id = 123
    mock_service.submit_application.return_value = mock_applicant

    data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@test.com",
        "file": (io.BytesIO(b"resume content"), "resume.pdf")
    }

    response = client.post(
        "/applicant/submit",
        data=data,
        content_type="multipart/form-data"
    )

    json_data = response.get_json()

    assert response.status_code == 201
    assert json_data["success"] is True
    assert json_data["applicant_id"] == 123


@patch("app.api.applicant.ApplicantService")
def test_submit_application_validation_error(mock_service, client):

    mock_service.submit_application.side_effect = ValueError("Invalid data")

    response = client.post("/applicant/submit", data={})

    json_data = response.get_json()

    assert response.status_code == 400
    assert json_data["success"] is False
    assert json_data["error"] == "Invalid data"


# ------------------------
# GET APPLICANT
# ------------------------

@patch("app.api.applicant.ApplicantService")
def test_get_applicant_success(mock_service, client):

    mock_applicant = MagicMock()
    mock_applicant.applicant_id = 1
    mock_applicant.first_name = "John"
    mock_applicant.last_name = "Doe"
    mock_applicant.email = "john@test.com"

    mock_service.get_applicant_by_id.return_value = mock_applicant

    response = client.get("/applicant/1")

    data = response.get_json()

    assert response.status_code == 200
    assert data["success"] is True
    assert data["data"]["id"] == 1
    assert data["data"]["email"] == "john@test.com"


@patch("app.api.applicant.ApplicantService")
def test_get_applicant_not_found(mock_service, client):

    mock_service.get_applicant_by_id.side_effect = ValueError("Applicant not found")

    response = client.get("/applicant/999")

    data = response.get_json()

    assert response.status_code == 404
    assert data["success"] is False


# ------------------------
# DELETE APPLICANT
# ------------------------

@patch("app.api.applicant.ApplicantService")
def test_delete_applicant_success(mock_service, client):

    mock_service.delete_applicant.return_value = None

    response = client.delete("/applicant/1")

    data = response.get_json()

    assert response.status_code == 200
    assert data["success"] is True
    assert data["message"] == "Applicant deleted successfully"


@patch("app.api.applicant.ApplicantService")
def test_delete_applicant_not_found(mock_service, client):

    mock_service.delete_applicant.side_effect = ValueError("Applicant not found")

    response = client.delete("/applicant/999")

    data = response.get_json()

    assert response.status_code == 404
    assert data["success"] is False


# ------------------------
# PARSE CV
# ------------------------

@patch("app.api.applicant.CVParserService")
def test_parse_cv_success(mock_parser, client):

    mock_parser.parse.return_value = {
        "name": "John Doe",
        "skills": ["Python", "Flask"]
    }

    response = client.post(
        "/applicant/parse-cv",
        json={"resume_text": "John Doe Python Flask"}
    )

    data = response.get_json()

    assert response.status_code == 200
    assert data["success"] is True
    assert data["data"]["name"] == "John Doe"


def test_parse_cv_missing_text(client):

    response = client.post("/applicant/parse-cv", json={})

    data = response.get_json()

    assert response.status_code == 400
    assert data["success"] is False
    assert data["error"] == "resume_text is required"


@patch("app.api.applicant.CVParserService")
def test_parse_cv_error(mock_parser, client):

    mock_parser.parse.side_effect = Exception("Parser failed")

    response = client.post(
        "/applicant/parse-cv",
        json={"resume_text": "sample resume"}
    )

    data = response.get_json()

    assert response.status_code == 500
    assert data["success"] is False