import pytest
from unittest.mock import patch, MagicMock
from app.services.job_service import JobService
from sqlalchemy.exc import IntegrityError
from app.extensions import db

# --- GET ALL JOBS ---

@patch("app.services.job_service.Job.query")
def test_get_all_jobs(mock_query, app, mock_job):
    with app.app_context():
        job1 = mock_job(status="Published")
        job2 = mock_job(status="Published")

        pagination = MagicMock()
        pagination.items = [job1, job2]
        pagination.total = 2
        pagination.pages = 1

        # Mock the chained query: Job.query.filter_by().order_by().paginate()
        mock_query.filter_by.return_value.order_by.return_value.paginate.return_value = pagination

        result = JobService.get_all_jobs()

        assert result["total"] == 2
        assert len(result["data"]) == 2


# --- GET SINGLE JOB ---

@patch("app.services.job_service.Job.query")
def test_get_single_job_success(mock_query, app, mock_job):
    with app.app_context():
        job = mock_job()
        job.updated_at = None

        mock_query.filter_by.return_value.first.return_value = job

        result = JobService.get_single_job("JOB-001")
        assert result["job_id"] == job.job_id


@patch("app.services.job_service.Job.query")
def test_get_single_job_not_found(mock_query, app):
    with app.app_context():
        mock_query.filter_by.return_value.first.return_value = None

        with pytest.raises(ValueError, match="Job not found"):
            JobService.get_single_job("JOB-001")


# --- CREATE JOB ---

@patch("app.services.job_service.db.session")
def test_create_job_success(mock_session, app):
    with app.app_context():
        data = {
            "job_id": "JOB-001",
            "title": "Software Engineer",
            "experience_required": "2",
            "application_deadline": "2025-12-31"
        }

        result = JobService.create_job(data)

        assert result is True
        mock_session.commit.assert_called_once()


def test_create_job_missing_title(app):
    with app.app_context():
        data = {"job_id": "JOB-001"}
        with pytest.raises(ValueError, match="Job title is required"):
            JobService.create_job(data)


def test_create_job_invalid_experience(app):
    with app.app_context():
        data = {
            "job_id": "JOB-001",
            "title": "Dev",
            "experience_required": "abc"
        }
        with pytest.raises(ValueError, match="Experience must be"):
            JobService.create_job(data)


@patch("app.services.job_service.db.session")
def test_create_job_duplicate(mock_session, app):
    with app.app_context():
        # Simulate a database duplicate key error
        mock_session.commit.side_effect = IntegrityError(None, None, None)
        
        data = {
            "job_id": "JOB-001",
            "title": "Software Engineer"
        }

        with pytest.raises(ValueError, match="Job ID already exists"):
            JobService.create_job(data)

        mock_session.rollback.assert_called_once()


# --- DELETE JOB ---

@patch("app.services.job_service.db.session")
@patch("app.services.job_service.Job.query")
def test_delete_job_success(mock_query, mock_session, app, mock_job):
    with app.app_context():
        job = mock_job()
        mock_query.get.return_value = job

        result = JobService.delete_job(1)

        assert result is True
        mock_session.delete.assert_called_once_with(job)
        mock_session.commit.assert_called_once()


@patch("app.services.job_service.Job.query")
def test_delete_job_not_found(mock_query, app):
    with app.app_context():
        mock_query.get.return_value = None

        with pytest.raises(ValueError, match="Job not found"):
            JobService.delete_job(1)