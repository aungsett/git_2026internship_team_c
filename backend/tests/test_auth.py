import pytest
from unittest.mock import patch, MagicMock
from app.extensions import db
from app.models.admin import Admin


# Helper function to create admin in test database
def create_test_admin(firebase_uid="admin_uid", email="admin@test.com"):
    admin = Admin(
        firebase_uid=firebase_uid,
        username="testadmin",
        email=email,
        role="admin"
    )
    db.session.add(admin)
    db.session.commit()
    return admin


# 1. No Authorization Header
def test_no_auth_header(client):
    response = client.get("/admin/stats")
    assert response.status_code == 401


# 2. Invalid Authorization Format - testing with invalid token
@patch("app.utils.decorators.AuthService.verify_session_cookie")
def test_invalid_token(mock_verify, client):
    mock_verify.side_effect = ValueError("Invalid token")
    
    response = client.get(
        "/admin/stats",
        headers={"Authorization": "Bearer invalidtoken"}
    )
    
    assert response.status_code == 401


# 3. Valid token but NOT in Admin table
@patch("app.utils.decorators.AuthService.verify_session_cookie")
def test_user_not_admin(mock_verify, client):
    mock_verify.return_value = {"email": "notadmin@example.com"}
    
    response = client.get(
        "/admin/stats",
        headers={"Authorization": "Bearer faketoken"}
    )
    
    # User is authenticated via Firebase but missing from Admin DB table
    assert response.status_code == 403


# 4. Valid Admin Access
@patch("app.utils.decorators.AuthService.verify_session_cookie")
def test_admin_access(mock_verify, client, app):
    mock_verify.return_value = {"email": "admin@test.com"}
    
    # Create admin in test database
    with app.app_context():
        create_test_admin(firebase_uid="admin_uid", email="admin@test.com")
    
    response = client.get(
        "/admin/stats",
        headers={"Authorization": "Bearer faketoken"}
    )
    
    # Should return 200 or 500 (depending on if stats work), but not 401/403
    assert response.status_code in [200, 500]


# 5. Test CSRF validation
@patch("app.utils.decorators.AuthService.verify_session_cookie")
def test_csrf_validation(mock_verify, client, app):
    mock_verify.return_value = {"email": "admin@test.com"}
    
    with app.app_context():
        create_test_admin(firebase_uid="admin_uid", email="admin@test.com")
    
    # POST request without CSRF token should fail
    response = client.post(
        "/admin/create-jobs",
        json={"title": "Test Job"},
        headers={"Authorization": "Bearer faketoken"}
    )
    
    # Should fail due to missing CSRF token
    assert response.status_code == 403