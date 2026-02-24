from flask import Flask
from config import Config
from .extensions import db, migrate
#from .routes.admin_routes import admin_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

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