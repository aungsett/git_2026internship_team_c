import pytest
from unittest.mock import patch, MagicMock
from app.services.email_service import EmailService


# --- APPLICATION RECEIVED EMAIL ---

@patch("app.services.email_service.mail.send")
@patch("app.services.email_service.Message")
def test_send_application_received_email(mock_message, mock_send, app):
    """Test sending application received confirmation email."""
    with app.app_context():
        # Setup mock message
        mock_msg = MagicMock()
        mock_message.return_value = mock_msg
        
        EmailService.send_application_received_email(
            "user@mail.com",
            "John",
            "Software Engineer",
            "JOB-001"
        )
        
        assert mock_message.called
        assert mock_send.called
        
        # Verify message was created with correct recipient
        mock_message.assert_called_with(
            subject="Application Received",
            recipients=["user@mail.com"],
            sender=None
        )


# --- SHORTLISTED EMAIL ---

@patch("app.services.email_service.mail.send")
@patch("app.services.email_service.Message")
def test_send_status_shortlisted(mock_message, mock_send, app):
    """Test sending shortlisted status email."""
    with app.app_context():
        mock_msg = MagicMock()
        mock_message.return_value = mock_msg
        
        EmailService.send_status_update_email(
            "user@mail.com",
            "John",
            "Shortlisted",
            "Software Engineer",
            "JOB-001"
        )
        
        assert mock_send.called
        
        # Verify correct subject line
        mock_message.assert_called_with(
            subject="Application Shortlisted",
            recipients=["user@mail.com"],
            sender=None
        )


# --- REJECTED EMAIL ---

@patch("app.services.email_service.mail.send")
@patch("app.services.email_service.Message")
def test_send_status_rejected(mock_message, mock_send, app):
    """Test sending rejected status email."""
    with app.app_context():
        mock_msg = MagicMock()
        mock_message.return_value = mock_msg
        
        EmailService.send_status_update_email(
            "user@mail.com",
            "John",
            "Rejected",
            "Software Engineer",
            "JOB-001"
        )
        
        assert mock_send.called
        
        # Verify correct subject line
        mock_message.assert_called_with(
            subject="Application Update",
            recipients=["user@mail.com"],
            sender=None
        )


# --- INTERVIEW EMAIL ---

@patch("app.services.email_service.mail.send")
@patch("app.services.email_service.Message")
def test_send_status_interviewed(mock_message, mock_send, app):
    """Test sending interview invitation email."""
    with app.app_context():
        mock_msg = MagicMock()
        mock_message.return_value = mock_msg
        
        EmailService.send_status_update_email(
            "user@mail.com",
            "John",
            "Interviewed",
            "Software Engineer",
            "JOB-001"
        )
        
        assert mock_send.called
        
        # Verify correct subject line
        mock_message.assert_called_with(
            subject="Interview Invitation",
            recipients=["user@mail.com"],
            sender=None
        )


# --- INVALID STATUS (NO EMAIL) ---

@patch("app.services.email_service.mail.send")
@patch("app.services.email_service.Message")
def test_send_status_invalid(mock_message, mock_send, app):
    """Test that invalid status does not send email."""
    with app.app_context():
        EmailService.send_status_update_email(
            "user@mail.com",
            "John",
            "Pending",
            "Software Engineer",
            "JOB-001"
        )
        
        mock_send.assert_not_called()


# --- EMAIL SERVICE ERROR HANDLING ---

@patch("app.services.email_service.mail.send")
@patch("app.services.email_service.Message")
def test_send_email_failure_handling(mock_message, mock_send, app):
    """Test that email service handles send failures gracefully."""
    with app.app_context():
        # When mail.send raises an exception, the service should handle it
        mock_send.side_effect = Exception("SMTP connection failed")
        
        # The service should propagate the exception or handle it based on implementation
        # This test verifies the expected behavior
        with pytest.raises(Exception, match="SMTP connection failed"):
            EmailService.send_application_received_email(
                "user@mail.com",
                "John",
                "Software Engineer",
                "JOB-001"
            )
