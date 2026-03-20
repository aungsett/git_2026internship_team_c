from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from .extensions import db, migrate, mail
from app.api.applicant import applicant_bp
from app.api.admin import admin_bp
from app.api.auth import auth_bp
from app.api.job import job_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-CSRF-Token"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

    @app.before_request
    def handle_options():
        if request.method == "OPTIONS":
            return jsonify({}), 200

    # Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    from . import models
    with app.app_context():
        db.create_all()

    # Register Blueprints
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(applicant_bp, url_prefix="/applicant")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(job_bp, url_prefix="/jobs")

    @app.route('/')
    def home():
        return "ATS Backend is Running!"

    return app