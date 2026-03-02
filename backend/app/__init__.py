from flask import Flask
from config import Config
from .extensions import db, migrate
from .api.admin import admin_bp
from .api.applicant import applicant_bp   # 👈 ADD THIS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    from . import models

    # Register Blueprints
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(applicant_bp)   # 👈 ADD THIS

    @app.route('/')
    def home():
        return "ATS Backend is Running!"

    return app