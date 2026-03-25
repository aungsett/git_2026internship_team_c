import pytest
from flask import Flask
from app.extensions import db
from app.models.job import Job
from app.services.job_service import JobService

# ---- PATCH ARRAY FOR SQLITE ----
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.compiler import compiles

@compiles(ARRAY, "sqlite")
def compile_array_sqlite(type_, compiler, **kw):
    return "TEXT"
# --------------------------------


# -------------------------
# TEST APP + DATABASE
# -------------------------

@pytest.fixture
def app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


# -------------------------
# CREATE JOB
# -------------------------

def test_create_job(app):

    data = {
        "job_id": "JOB001",
        "title": "Backend Developer",
        "location": "Remote",
        "employment_type": "Full-time",
        "department": "Engineering",
        "salary_range": "5-10 LPA",
        "experience_required": "2 years",
        "skills": ["Python", "Flask"],
        "application_deadline": "2026-12-01"
    }

    result = JobService.create_job(data)

    job = Job.query.first()

    assert result is True
    assert job.title == "Backend Developer"
    assert job.location == "Remote"


# -------------------------
# GET ALL JOBS
# -------------------------

def test_get_all_jobs(app):

    job = Job(
        job_id="JOB002",
        title="Frontend Developer",
        location="Remote",
        employment_type="Full-time",
        department="Engineering",
        salary_range="4-8 LPA",
        experience_required="1 year",
        skills=["React"],
        status="Open"
    )

    db.session.add(job)
    db.session.commit()

    result = JobService.get_all_jobs()

    assert result["total"] == 1
    assert result["data"][0]["title"] == "Frontend Developer"


# -------------------------
# GET SINGLE JOB
# -------------------------

def test_get_single_job(app):

    job = Job(
        job_id="JOB003",
        title="DevOps Engineer",
        location="Remote",
        employment_type="Full-time",
        department="Infrastructure",
        salary_range="6-12 LPA",
        experience_required="3 years",
        skills=["Docker"],
        status="Open"
    )

    db.session.add(job)
    db.session.commit()

    result = JobService.get_single_job(job.id)

    assert result["title"] == "DevOps Engineer"
    assert result["department"] == "Infrastructure"


# -------------------------
# JOB NOT FOUND
# -------------------------

def test_get_single_job_not_found(app):

    with pytest.raises(ValueError):
        JobService.get_single_job(999)


# -------------------------
# DELETE JOB
# -------------------------

def test_delete_job(app):

    job = Job(
        job_id="JOB004",
        title="QA Engineer",
        location="Remote",
        employment_type="Full-time",
        department="QA",
        salary_range="3-6 LPA",
        experience_required="1 year",
        skills=["Testing"],
        status="Open"
    )

    db.session.add(job)
    db.session.commit()

    result = JobService.delete_job(job.id)

    assert result is True
    assert Job.query.get(job.id) is None