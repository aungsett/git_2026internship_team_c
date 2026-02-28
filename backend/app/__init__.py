from flask import Flask
from flask_cors import CORS
from config import Config
from .extensions import db, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Allow frontend (localhost:3000) to call the backend
    CORS(app, origins=["http://localhost:3000"])

    # Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)

    from . import models

    from app.api.applicant import applicant_bp
    app.register_blueprint(applicant_bp)

    from app.api.admin import admin_bp
    app.register_blueprint(admin_bp)

    from app.api.auth import auth_bp
    app.register_blueprint(auth_bp)

    from app.api.job import job_bp
    app.register_blueprint(job_bp)

    # Register Blueprints
    #app.register_blueprint(admin_bp, url_prefix="/admin") 

    @app.route('/')
    def home():
        return "ATS Backend is Running!"

    return app