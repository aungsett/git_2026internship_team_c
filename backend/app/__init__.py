from flask import Flask
from config import Config
from .extensions import db, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)

    from . import models

    @app.route('/')
    def home():
        return "ATS Backend is Running!"

    return app