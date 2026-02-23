import pytest
from unittest.mock import patch
from app.extensions import db
from app.models import Admin


# 1. No Authorization Header
def test_no_auth_header(client):
    response = client.get("/admin/test")
    assert response.status_code == 401
    assert b"Authorization header missing" in response.data


# 2. Invalid Authorization Format
def test_invalid_auth_format(client):
    response = client.get(
        "/admin/test",
        headers={"Authorization": "InvalidToken"}
    )
    assert response.status_code == 401


# 3. Valid token but NOT in Admin table
@patch("firebase_admin.auth.verify_id_token")
def test_user_not_admin(mock_verify, client):
    mock_verify.return_value = {
        "uid": "random_uid"
    }

    response = client.get(
        "/admin/test",
        headers={"Authorization": "Bearer faketoken"}
    )

    # User exists in Firebase but not in Admin table
    assert response.status_code == 403


# 4. Valid Admin Access
@patch("firebase_admin.auth.verify_id_token")
def test_admin_access(mock_verify, client):
    mock_verify.return_value = {
        "uid": "admin_uid"
    }

    # Insert admin into test DB
    admin = Admin(
        firebase_uid="admin_uid",
        username="testadmin",
        email="admin@test.com",
        role="admin"
    )
    db.session.add(admin)
    db.session.commit()

    response = client.get(
        "/admin/test",
        headers={"Authorization": "Bearer faketoken"}
    )

    assert response.status_code == 200
    assert b"Admin access granted" in response.data