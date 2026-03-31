import pytest
from sqlalchemy.exc import IntegrityError
from app.extensions import db
from app.models.job import Job
from datetime import date


# 1. Test Job Creation
def test_create_job(app):
    job = Job(
        job_id="JOB-001",
        title="Software Engineer",
        description="Develop and maintain software.",
        location="Remote",
        employment_type="Full-time"
    )

    db.session.add(job)
    db.session.commit()

    saved_job = Job.query.filter_by(job_id="JOB-001").first()

    assert saved_job is not None
    assert saved_job.title == "Software Engineer"
    assert saved_job.location == "Remote"


# 2. Test Default Status is Draft
def test_default_status(app):
    job = Job(
        job_id="JOB-002",
        title="Data Analyst",
        description="Analyze data.",
        location="On-site",
        employment_type="Contract"
    )

    db.session.add(job)
    db.session.commit()

    assert job.status == "draft"


# 3. Test Default Experience Required is 0
def test_default_experience_required(app):
    job = Job(
        job_id="JOB-003",
        title="Intern",
        description="Internship role.",
        location="Hybrid",
        employment_type="Internship"
    )

    db.session.add(job)
    db.session.commit()

    assert job.experience_required == 0


# 4. Test Optional Fields Can Be Null
def test_optional_fields_nullable(app):
    job = Job(
        job_id="JOB-004",
        title="Designer",
        description="UI/UX Design role.",
        location="Remote",
        employment_type="Full-time"
    )

    db.session.add(job)
    db.session.commit()

    saved_job = Job.query.filter_by(job_id="JOB-004").first()

    assert saved_job.department is None
    assert saved_job.salary_range is None
    assert saved_job.skills is None
    assert saved_job.application_deadline is None


# 5. Test Duplicate job_id Fails
def test_duplicate_job_id(app):
    job1 = Job(
        job_id="JOB-005",
        title="Backend Dev",
        description="Backend role.",
        location="Remote",
        employment_type="Full-time"
    )

    job2 = Job(
        job_id="JOB-005",
        title="Frontend Dev",
        description="Frontend role.",
        location="Remote",
        employment_type="Full-time"
    )

    db.session.add(job1)
    db.session.commit()

    db.session.add(job2)

    with pytest.raises(IntegrityError):
        db.session.commit()

    db.session.rollback()


# 6. Test Required Fields Cannot Be Null
def test_title_required(app):
    job = Job(
        job_id="JOB-006",
        title=None,
        description="Some description.",
        location="Remote",
        employment_type="Full-time"
    )

    db.session.add(job)

    with pytest.raises(IntegrityError):
        db.session.commit()

    db.session.rollback()


def test_job_id_required(app):
    job = Job(
        job_id=None,
        title="Some Title",
        description="Some description.",
        location="Remote",
        employment_type="Full-time"
    )

    db.session.add(job)

    with pytest.raises(IntegrityError):
        db.session.commit()

    db.session.rollback()


# 7. Test Skills Stored as Array
def test_skills_stored_as_array(app):
    job = Job(
        job_id="JOB-007",
        title="Full Stack Dev",
        description="Full stack role.",
        location="Remote",
        employment_type="Full-time",
        skills=["Python", "React", "PostgreSQL"]
    )

    db.session.add(job)
    db.session.commit()

    saved_job = Job.query.filter_by(job_id="JOB-007").first()

    assert saved_job.skills == ["Python", "React", "PostgreSQL"]


# 8. Test Timestamps Are Set on Creation
def test_timestamps_set_on_creation(app):
    job = Job(
        job_id="JOB-008",
        title="DevOps Engineer",
        description="DevOps role.",
        location="Remote",
        employment_type="Full-time"
    )

    db.session.add(job)
    db.session.commit()

    assert job.created_at is not None
    assert job.updated_at is not None


# 9. Test Job Status Can Be Updated to Published
def test_status_update_to_published(app):
    job = Job(
        job_id="JOB-009",
        title="QA Engineer",
        description="Testing role.",
        location="Remote",
        employment_type="Full-time"
    )

    db.session.add(job)
    db.session.commit()

    job.status = "published"
    db.session.commit()

    updated_job = Job.query.filter_by(job_id="JOB-009").first()
    assert updated_job.status == "published"


# 10. Test Job Deletion
def test_delete_job(app):
    job = Job(
        job_id="JOB-010",
        title="PM",
        description="Product manager role.",
        location="On-site",
        employment_type="Full-time"
    )

    db.session.add(job)
    db.session.commit()

    db.session.delete(job)
    db.session.commit()

    deleted_job = Job.query.filter_by(job_id="JOB-010").first()
    assert deleted_job is None