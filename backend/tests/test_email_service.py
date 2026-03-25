import pytest
from flask import Flask
from unittest.mock import patch
from app.services.email_service import EmailService


@pytest.fixture
def app():
    app = Flask(__name__)
    app.config["MAIL_USERNAME"] = "test@example.com"

    with app.app_context():
        yield app


# -------------------------
# APPLICATION RECEIVED EMAIL
# -------------------------

@patch("app.services.email_service.mail.send")
def test_send_application_received_email(mock_send, app):

    EmailService.send_application_received_email(
        "user@test.com",
        "John"
    )

    assert mock_send.called

    msg = mock_send.call_args[0][0]

    assert msg.subject == "Application Received"
    assert msg.recipients == ["user@test.com"]
    assert "John" in msg.body


# -------------------------
# SHORTLISTED EMAIL
# -------------------------

@patch("app.services.email_service.mail.send")
def test_send_shortlisted_email(mock_send, app):

    EmailService.send_status_update_email(
        "user@test.com",
        "John",
        "shortlisted"
    )

    assert mock_send.called

    msg = mock_send.call_args[0][0]

    assert msg.subject == "Application Shortlisted"
    assert "John" in msg.body


# -------------------------
# REJECTED EMAIL
# -------------------------

@patch("app.services.email_service.mail.send")
def test_send_rejected_email(mock_send, app):

    EmailService.send_status_update_email(
        "user@test.com",
        "John",
        "rejected"
    )

    assert mock_send.called

    msg = mock_send.call_args[0][0]

    assert msg.subject == "Application Update"
    assert "John" in msg.body


# -------------------------
# INVALID STATUS (NO EMAIL)
# -------------------------

@patch("app.services.email_service.mail.send")
def test_send_status_invalid(mock_send, app):

    EmailService.send_status_update_email(
        "user@test.com",
        "John",
        "pending"
    )

    mock_send.assert_not_called()