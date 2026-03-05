from flask_mail import Message
from app.extensions import mail

class EmailService:
    @staticmethod
    def send_application_received_email(email, first_name):
        msg = Message(
            subject="Application Received",
            recipients=[email],
            sender="teamc.webapp@gmail.com"  # FORCING IT HERE
        )
        msg.body = f"Hi {first_name},\n\nThank you for applying!"
        mail.send(msg)