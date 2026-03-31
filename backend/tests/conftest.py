# 1. TOP OF FILE: Setup Mocks and Patches immediately
import sqlalchemy
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects.sqlite.base import SQLiteTypeCompiler
from unittest.mock import MagicMock

# Force SQLAlchemy to treat ARRAY as JSON during tests
sqlalchemy.ARRAY = MagicMock(return_value=sqlalchemy.JSON)
postgresql.ARRAY = MagicMock(return_value=sqlalchemy.JSON)

# Tell the SQLite compiler how to handle the 'ARRAY' type so it doesn't crash
def visit_ARRAY(self, type_, **kw):
    return "TEXT"

SQLiteTypeCompiler.visit_ARRAY = visit_ARRAY

# 2. NOW import everything else
import pytest
from datetime import datetime, date
from app import create_app
from app.extensions import db

@pytest.fixture
def app():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        "MAIL_SUPPRESS_SEND": True,
        "MAIL_SERVER": "localhost",
        "MAIL_PORT": 25,
        "MAIL_USE_TLS": False,
        "MAIL_USERNAME": None,
        "MAIL_PASSWORD": None,
        "MAIL_DEFAULT_SENDER": "test@example.com",
        "SECRET_KEY": "test-secret-key",
        "FIREBASE_CREDENTIALS": None,
        "CLOUDINARY_CLOUD_NAME": "test",
        "CLOUDINARY_API_KEY": "test",
        "CLOUDINARY_API_SECRET": "test",
        "CV_PARSER_API_KEY": "test",
        "S3_BUCKET_NAME": "test-bucket",
        "S3_REGION": "us-east-1",
        "AWS_ACCESS_KEY_ID": "test",
        "AWS_SECRET_ACCESS_KEY": "test",
    })

    with app.app_context():
        # Because of the patch above, this will now succeed
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def app_context(app):
    """Provide an application context for tests."""
    with app.app_context():
        yield

@pytest.fixture
def client(app):
    return app.test_client()

# ---------------- MOCKS ---------------- #

@pytest.fixture
def mock_applicant():
    def make(**kwargs):
        from app.models.applicant import Applicant
        a = MagicMock(spec=Applicant)
        a.applicant_id = kwargs.get("applicant_id", "APP-001")
        a.first_name = kwargs.get("first_name", "John")
        a.last_name = kwargs.get("last_name", "Doe")
        a.email = kwargs.get("email", "john@example.com")
        a.phone_number = kwargs.get("phone_number", "1234567890")
        a.qualification = kwargs.get("qualification", "B.Tech")
        a.work_experience = kwargs.get("work_experience", 2)
        a.preferred_japanese_course = kwargs.get("preferred_japanese_course", "N3")
        a.skills = kwargs.get("skills", ["Python"])
        a.created_at = kwargs.get("created_at", datetime(2024, 1, 1))
        a.date_of_birth = kwargs.get("date_of_birth", date(1998, 1, 1))
        a.address = kwargs.get("address", "123 Street")
        a.college = kwargs.get("college", "MIT")
        a.language = kwargs.get("language", "English")
        a.social_links = kwargs.get("social_links", {})
        a.professional_summary = kwargs.get("professional_summary", "Summary here")
        a.comments = kwargs.get("comments", "")
        return a
    return make

@pytest.fixture
def mock_review(mock_applicant):
    def make(**kwargs):
        from app.models.review import ApplicationReview
        r = MagicMock(spec=ApplicationReview)
        r.review_id = kwargs.get("review_id", "REV-001")
        r.job_id = kwargs.get("job_id", "JOB-001")
        r.status = kwargs.get("status", "Pending")
        r.admin_id = kwargs.get("admin_id", "ADM-001")
        r.reviewed_at = kwargs.get("reviewed_at", datetime(2024, 1, 1))
        r.comments = kwargs.get("comments", "")
        r.applicant = kwargs.get("applicant", mock_applicant())
        r.job = MagicMock()
        r.job.title = kwargs.get("job_title", "Software Engineer")
        r.document = None
        return r
    return make

@pytest.fixture
def mock_job():
    def make(**kwargs):
        from app.models.job import Job
        j = MagicMock(spec=Job)
        j.id = kwargs.get("id", 1)
        j.job_id = kwargs.get("job_id", "JOB-001")
        j.title = kwargs.get("title", "Software Engineer")
        j.location = kwargs.get("location", "Remote")
        j.employment_type = kwargs.get("employment_type", "Full-time")
        j.department = kwargs.get("department", "Engineering")
        j.description = kwargs.get("description", "Some description")
        j.salary_range = kwargs.get("salary_range", "80k-100k")
        j.experience_required = kwargs.get("experience_required", 2)
        j.skills = kwargs.get("skills", ["Python"])
        j.application_deadline = kwargs.get("application_deadline", date(2025, 12, 31))
        j.status = kwargs.get("status", "draft")
        j.created_at = kwargs.get("created_at", datetime(2024, 1, 1))
        j.updated_at = kwargs.get("updated_at", datetime(2024, 1, 1))
        return j
    return make

@pytest.fixture
def mock_admin():
    def make(**kwargs):
        from app.models.admin import Admin
        a = MagicMock(spec=Admin)
        a.admin_id = kwargs.get("admin_id", "ADM-001")
        a.firebase_uid = kwargs.get("firebase_uid", "test_uid")
        a.username = kwargs.get("username", "testadmin")
        a.email = kwargs.get("email", "admin@test.com")
        a.role = kwargs.get("role", "admin")
        a.created_at = kwargs.get("created_at", datetime(2024, 1, 1))
        return a
    return make