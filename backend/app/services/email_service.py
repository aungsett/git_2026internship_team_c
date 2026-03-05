from flask_mail import Message
from flask import current_app
from app.extensions import mail

class EmailService:
    @staticmethod
    def send_application_received_email(email, first_name):
        msg = Message(
            subject="Application Received",
            recipients=[email],
            sender=current_app.config['MAIL_USERNAME']
        )
        msg.body = f"""Hi {first_name},

        Thank you for applying! We have received your application and our team will review it shortly.
        
        You will hear back from us once the review is complete.
        
        Best regards,
        Team C"""
        mail.send(msg)
