import pytest
from unittest.mock import patch, MagicMock
from app.services.admin_service import AdminService


# -------------------------
# GET ALL APPLICATIONS
# -------------------------

@patch("app.services.admin_service.Applicant")
def test_get_all_applications(mock_applicant):

    mock_pagination = MagicMock()

    mock_app = MagicMock()
    mock_app.applicant_id = 1
    mock_app.first_name = "John"
    mock_app.last_name = "Doe"
    mock_app.email = "john@test.com"
    mock_app.qualification = "B.Tech"
    mock_app.work_experience = 2
    mock_app.created_at.isoformat.return_value = "2024-01-01T00:00:00"
    mock_app.reviews = []

    mock_pagination.items = [mock_app]
    mock_pagination.total = 1
    mock_pagination.pages = 1

    mock_query = MagicMock()
    mock_query.order_by.return_value.paginate.return_value = mock_pagination
    mock_applicant.query = mock_query

    result = AdminService.get_all_applications()

    assert result["total"] == 1
    assert result["pages"] == 1
    assert result["data"][0]["email"] == "john@test.com"


# -------------------------
# GET SINGLE APPLICATION
# -------------------------

@patch("app.services.admin_service.Applicant")
def test_get_single_application_success(mock_applicant):

    mock_app = MagicMock()
    mock_app.document = MagicMock()
    mock_app.document.document_url = "cloudinary-url"

    mock_review = MagicMock()
    mock_review.status = "Approved"
    mock_review.comments = "Good"
    mock_review.reviewed_at.isoformat.return_value = "2024-01-01T00:00:00"

    mock_app.reviews = [mock_review]

    mock_app.to_dict.return_value = {"id": 1}

    mock_applicant.query.get.return_value = mock_app

    result = AdminService.get_single_application(1)

    assert result["document_url"] == "cloudinary-url"
    assert result["review"]["status"] == "Approved"


@patch("app.services.admin_service.Applicant")
def test_get_single_application_not_found(mock_applicant):

    mock_applicant.query.get.return_value = None

    with pytest.raises(ValueError):
        AdminService.get_single_application(1)


# -------------------------
# REVIEW APPLICATION
# -------------------------

@patch("app.services.admin_service.EmailService")
@patch("app.services.admin_service.db")
@patch("app.services.admin_service.ApplicationReview")
@patch("app.services.admin_service.Applicant")
@patch("app.services.admin_service.Admin")
def test_review_application_new_review(
    mock_admin,
    mock_applicant,
    mock_review_model,
    mock_db,
    mock_email
):

    mock_admin.query.get.return_value = MagicMock()

    mock_app = MagicMock()
    mock_app.email = "john@test.com"
    mock_app.first_name = "John"
    mock_applicant.query.get.return_value = mock_app

    mock_review_model.query.filter_by.return_value.first.return_value = None

    result = AdminService.review_application(
        applicant_id=1,
        status="Approved",
        comments="Good",
        admin_id=1
    )

    assert result is True
    mock_email.send_status_update_email.assert_called_once()


@patch("app.services.admin_service.Admin")
def test_review_application_admin_not_found(mock_admin):

    mock_admin.query.get.return_value = None

    with pytest.raises(ValueError):
        AdminService.review_application(1, "Approved", "Good", 1)


@patch("app.services.admin_service.Admin")
@patch("app.services.admin_service.Applicant")
def test_review_application_applicant_not_found(mock_applicant, mock_admin):

    mock_admin.query.get.return_value = MagicMock()
    mock_applicant.query.get.return_value = None

    with pytest.raises(ValueError):
        AdminService.review_application(1, "Approved", "Good", 1)


# -------------------------
# EXPORT CSV
# -------------------------

@patch("app.services.admin_service.Applicant")
def test_export_applicants_csv(mock_applicant):

    mock_app = MagicMock()
    mock_app.applicant_id = 1
    mock_app.first_name = "John"
    mock_app.last_name = "Doe"
    mock_app.email = "john@test.com"
    mock_app.phone_number = "9999999999"
    mock_app.qualification = "B.Tech"
    mock_app.work_experience = 2
    mock_app.professional_summary = "Developer"

    mock_applicant.query.all.return_value = [mock_app]

    csv_data = AdminService.export_applicants_csv()

    assert "John Doe" in csv_data
    assert "john@test.com" in csv_data