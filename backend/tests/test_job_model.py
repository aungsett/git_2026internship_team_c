import pytest
from datetime import date
from app.extensions import db
from app.models.job import Job


def create_job(**kwargs):
    """Helper function to create a valid job"""
    data = {
        "job_id": "JOB-001",
        "title": "Backend Engineer",
        "description": "Build APIs",
        "location": "Remote",
        "employment_type": "Full-time",
        "skills": ["Python", "Flask"]
    }

    data.update(kwargs)
    return Job(**data)


def test_create_job(app):

    job = create_job()

    db.session.add(job)
    db.session.commit()

    saved_job = Job.query.first()

    assert saved_job is not None
    assert saved_job.job_id == "JOB-001"
    assert saved_job.title == "Backend Engineer"
    assert saved_job.location == "Remote"
    assert saved_job.skills == ["Python", "Flask"]


def test_job_default_status(app):

    job = create_job(job_id="JOB-002")

    db.session.add(job)
    db.session.commit()

    saved_job = Job.query.filter_by(job_id="JOB-002").first()

    assert saved_job.status == "Open"


def test_job_timestamps(app):

    job = create_job(job_id="JOB-003")

    db.session.add(job)
    db.session.commit()

    saved_job = Job.query.filter_by(job_id="JOB-003").first()

    assert saved_job.created_at is not None
    assert saved_job.updated_at is not None


def test_job_unique_job_id(app):

    job1 = create_job(job_id="JOB-004")
    job2 = create_job(job_id="JOB-004")

    db.session.add(job1)
    db.session.commit()

    db.session.add(job2)

    with pytest.raises(Exception):
        db.session.commit()


def test_job_optional_fields(app):

    job = create_job(
        job_id="JOB-005",
        department="Engineering",
        salary_range="10-15 LPA",
        experience_required=3,
        application_deadline=date(2026, 12, 31)
    )

    db.session.add(job)
    db.session.commit()

    saved_job = Job.query.filter_by(job_id="JOB-005").first()

    assert saved_job.department == "Engineering"
    assert saved_job.salary_range == "10-15 LPA"
    assert saved_job.experience_required == 3
    assert saved_job.application_deadline.year == 2026


def test_job_repr(app):

    job = create_job(job_id="JOB-006", title="ML Engineer")

    assert repr(job) == "<Job ML Engineer>"