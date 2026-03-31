import pytest
from unittest.mock import patch, MagicMock
from app.services.admin_service import AdminService
from app.extensions import db
from app.models.admin import Admin
from app.models.applicant import Applicant
from app.models.job import Job
from app.models.review import ApplicationReview


@pytest.fixture
def setup_test_data(app):
    with app.app_context():
        admin = Admin(
            firebase_uid="test_admin_uid",
            username="testadmin",
            email="admin@test.com",
            role="admin"
        )
        db.session.add(admin)
        
        job = Job(
            job_id="JOB-TEST-001",
            title="Test Job",
            description="Test job description",
            location="Remote",
            employment_type="Full-time",
            status="Published"
        )
        db.session.add(job)
        
        applicant = Applicant(
            first_name="Test",
            last_name="User",
            email="testuser@example.com"
        )
        db.session.add(applicant)
        db.session.flush()
        
        review = ApplicationReview(
            applicant_id=applicant.applicant_id,
            job_id=job.job_id,
            admin_id=admin.admin_id,
            status="Pending"
        )
        db.session.add(review)
        db.session.commit()
        
        return {
            "admin": admin,
            "job": job,
            "applicant": applicant,
            "review": review
        }


def test_get_single_application_success(app, setup_test_data):
    with app.app_context():
        from app.models.review import ApplicationReview
        review = ApplicationReview.query.first()
        review_id = review.review_id
        result = AdminService.get_single_application(review_id)
        assert result is not None


def test_get_single_application_not_found(app):
    with app.app_context():
        with pytest.raises(ValueError, match="Application not found"):
            AdminService.get_single_application(99999)


@patch("app.extensions.db.session.commit")
@patch("app.models.review.ApplicationReview.query")
@patch("app.models.admin.Admin.query")
@patch("app.models.applicant.Applicant.query")
def test_review_application_flow(mock_applicant_query, mock_admin_query, mock_review_query, mock_commit, app):
    with app.app_context():
        mock_review = MagicMock()
        mock_review.status = "Pending"
        mock_review_query.filter_by.return_value.first.return_value = mock_review
        
        mock_admin = MagicMock()
        mock_admin_query.get.return_value = mock_admin
        
        mock_applicant = MagicMock()
        mock_applicant_query.get.return_value = mock_applicant
        
        result = AdminService.review_application(
            applicant_id="APP-001",
            job_id="JOB-001",
            status="Shortlisted",
            admin_id="ADM-001"
        )
        
        assert result is True
        assert mock_review.status == "Shortlisted"


@patch("app.extensions.db.session.query")
def test_get_admin_stats(mock_query, app):
    with app.app_context():
        mock_query_instance = MagicMock()
        mock_query.return_value = mock_query_instance
        mock_query_instance.scalar.return_value = 50
        
        mock_group_query = MagicMock()
        mock_query_instance.group_by.return_value = mock_group_query
        mock_group_query.all.return_value = [("Pending", 30), ("Shortlisted", 10), ("Rejected", 10)]
        
        stats = AdminService.get_admin_stats()
        
        assert stats is not None
        assert isinstance(stats, dict)


@patch("app.models.applicant.Applicant.query")
def test_export_applicants_csv(mock_query, app):
    with app.app_context():
        mock_applicant = MagicMock()
        mock_applicant.first_name = "John"
        mock_applicant.last_name = "Doe"
        mock_applicant.email = "john@example.com"
        mock_applicant.phone_number = "1234567890"
        mock_applicant.qualification = "B.Tech"
        mock_applicant.work_experience = 2
        mock_applicant.professional_summary = "Summary"
        
        mock_query.all.return_value = [mock_applicant]
        
        csv_output = AdminService.export_applicants_csv()
        
        assert csv_output is not None
        assert isinstance(csv_output, str)
        assert "John" in csv_output or "Doe" in csv_output


@patch("app.models.job.Job.query")
def test_get_all_jobs(mock_query, app):
    with app.app_context():
        mock_job1 = MagicMock()
        mock_job1.job_id = "JOB-001"
        mock_job1.title = "Software Engineer"
        mock_job1.status = "Published"
        
        mock_job2 = MagicMock()
        mock_job2.job_id = "JOB-002"
        mock_job2.title = "Data Analyst"
        mock_job2.status = "Draft"
        
        mock_query.filter_by.return_value.all.return_value = [mock_job1, mock_job2]
        
        result = AdminService.get_all_jobs()
        
        assert result is not None
        assert "jobs" in result or "data" in result or isinstance(result, list)