from flask import Flask
from flask_cors import CORS
from config import Config
from .extensions import db, migrate, mail  # Added mail here
from app.api.applicant import applicant_bp
from app.api.admin import admin_bp
from app.api.auth import auth_bp
from app.api.job import job_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Allow frontend (localhost:3000) to call the backend
    CORS(app, origins=["http://localhost:3000"])

    # Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)  # Initialize mail with the app

    from . import models
    # AUTO-FIX: Create tables if missing on every server start
    with app.app_context():
        db.create_all()

    # Register Blueprints with URL prefixes
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(applicant_bp, url_prefix="/applicant")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(job_bp, url_prefix="/jobs")

    @app.route('/')
    def home():
        return "ATS Backend is Running!"

    return app
