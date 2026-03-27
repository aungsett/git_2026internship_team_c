from flask_mail import Message
from flask import current_app
from app.extensions import mail


class EmailService:

    @staticmethod
    def send_application_received_email(email, first_name, job_title, job_id):
        msg = Message(
            subject="Application Received",
            recipients=[email],
            sender=current_app.config['MAIL_USERNAME']
        )

        msg.body = f"""Hi {first_name},

Thank you for applying! We have received your application for the position of {job_title} (Job ID: {job_id}) and our team will review it shortly.

You will hear back from us once the review is complete.

Best regards,
Team C
"""

        mail.send(msg)


    @staticmethod
    def send_status_update_email(email, first_name, status, job_title, job_id):
        subject = ""
        body = ""

        if status == "Shortlisted":
            subject = "Application Shortlisted"
            body = f"""Hi {first_name},

Good news! Your application for the position of {job_title} (Job ID: {job_id}) has been shortlisted.

Our team will contact you soon with the next steps.

Best regards,
Team C
"""

        elif status == "Rejected":
            subject = "Application Update"
            body = f"""Hi {first_name},

Thank you for applying for the position of {job_title} (Job ID: {job_id}). After reviewing your application, we regret to inform you that we will not be moving forward.

We appreciate your interest and wish you success in your job search.

Best regards,
Team C
"""

        else:
            return  # don't send email for other statuses


        msg = Message(
            subject=subject,
            recipients=[email],
            sender=current_app.config['MAIL_USERNAME']
        )

        msg.body = body

        mail.send(msg)