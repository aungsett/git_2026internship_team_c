import pytest
from unittest.mock import patch, MagicMock
from app.services.auth_service import AuthService


# -----------------------
# VERIFY FIREBASE TOKEN
# -----------------------

@patch("app.services.auth_service.firebase_auth")
def test_verify_firebase_token_success(mock_firebase):

    mock_firebase.verify_id_token.return_value = {"uid": "123"}

    result = AuthService.verify_firebase_token("token")

    assert result["uid"] == "123"


def test_verify_firebase_token_missing():

    with pytest.raises(ValueError):
        AuthService.verify_firebase_token(None)


# -----------------------
# EXTRACT USER INFO
# -----------------------

def test_extract_user_info_success():

    decoded = {
        "email": "test@example.com",
        "name": "John Doe"
    }

    email, name = AuthService.extract_user_info(decoded)

    assert email == "test@example.com"
    assert name == "John Doe"


def test_extract_user_info_missing_email():

    decoded = {"name": "John"}

    with pytest.raises(ValueError):
        AuthService.extract_user_info(decoded)


# -----------------------
# ADMIN LOGIN
# -----------------------

@patch("app.services.auth_service.db")
@patch("app.services.auth_service.Admin")
@patch("app.services.auth_service.AuthService.extract_user_info")
@patch("app.services.auth_service.AuthService.verify_firebase_token")
def test_admin_login_existing_admin(
    mock_verify,
    mock_extract,
    mock_admin_model,
    mock_db
):

    mock_verify.return_value = {"uid": "123"}
    mock_extract.return_value = ("admin@test.com", "Admin User")

    mock_admin = MagicMock()
    mock_admin.admin_id = 1
    mock_admin.email = "admin@test.com"

    mock_admin_model.query.filter_by.return_value.first.return_value = mock_admin

    result = AuthService.admin_login("token")

    assert result["role"] == "admin"
    assert result["admin_id"] == 1
    assert result["email"] == "admin@test.com"


@patch("app.services.auth_service.db")
@patch("app.services.auth_service.Admin")
@patch("app.services.auth_service.AuthService.extract_user_info")
@patch("app.services.auth_service.AuthService.verify_firebase_token")
def test_admin_login_create_new_admin(
    mock_verify,
    mock_extract,
    mock_admin_model,
    mock_db
):

    mock_verify.return_value = {"uid": "123"}
    mock_extract.return_value = ("new@test.com", "New Admin")

    mock_admin_model.query.filter_by.return_value.first.return_value = None

    mock_admin = MagicMock()
    mock_admin.admin_id = 10
    mock_admin.email = "new@test.com"

    mock_admin_model.return_value = mock_admin

    result = AuthService.admin_login("token")

    assert result["role"] == "admin"
    mock_db.session.add.assert_called_once()
    mock_db.session.commit.assert_called_once()


# -----------------------
# APPLICANT LOGIN
# -----------------------

@patch("app.services.auth_service.Applicant")
@patch("app.services.auth_service.AuthService.extract_user_info")
@patch("app.services.auth_service.AuthService.verify_firebase_token")
def test_applicant_login_existing(
    mock_verify,
    mock_extract,
    mock_applicant_model
):

    mock_verify.return_value = {"uid": "123"}
    mock_extract.return_value = ("user@test.com", "User")

    mock_applicant = MagicMock()
    mock_applicant.applicant_id = 5

    mock_applicant_model.query.filter_by.return_value.first.return_value = mock_applicant

    result = AuthService.applicant_login("token")

    assert result["role"] == "applicant"
    assert result["applicant_id"] == 5
    assert result["email"] == "user@test.com"


@patch("app.services.auth_service.Applicant")
@patch("app.services.auth_service.AuthService.extract_user_info")
@patch("app.services.auth_service.AuthService.verify_firebase_token")
def test_applicant_login_not_registered(
    mock_verify,
    mock_extract,
    mock_applicant_model
):

    mock_verify.return_value = {"uid": "123"}
    mock_extract.return_value = ("user@test.com", "User")

    mock_applicant_model.query.filter_by.return_value.first.return_value = None

    result = AuthService.applicant_login("token")

    assert result["role"] == "applicant"
    assert result["applicant_id"] is None