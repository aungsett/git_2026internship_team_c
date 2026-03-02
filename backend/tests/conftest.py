import sys
import os
import pytest

# -----------------------------
# Make backend folder discoverable
# -----------------------------
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import pytest
from app import create_app
from app.extensions import db


@pytest.fixture
def app():
    # Create app instance
    app = create_app()

    # Override config for testing
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"
    })

    # Create temporary database
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()