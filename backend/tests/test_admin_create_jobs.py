import json
from app.models.job import Job

def test_create_job(client, admin_token):
    job_data = {
        "job_id": "JOB-200",
        "title": "Machine Learning Engineer",
        "description": "Build ML models",
        "location": "Tokyo",
        "employment_type": "Full-time",
        "department": "AI",
        "salary_range": "6M-10M",
        "experience_required": "2 years",
        "skills": ["Python", "TensorFlow"],
        "application_deadline": "2026-04-30",
        "status": "Open"
    }

    response = client.post(
        "/admin/jobs",
        data=json.dumps(job_data),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {admin_token}"
        }
    )

    assert response.status_code == 201
    data = response.get_json()
    assert data["success"] == True
     

    # check database
    job = Job.query.filter_by(title="Machine Learning Engineer").first()
    assert job is not None
