import pytest
from flask import Flask
from unittest.mock import patch, MagicMock
from app.services.cv_parser_service import CVParserService


@pytest.fixture
def app():
    app = Flask(__name__)
    app.config["GEMINI_API_KEY"] = "test_key"

    with app.app_context():
        yield app


# -------------------------
# MISSING API KEY
# -------------------------

def test_parse_missing_api_key():
    app = Flask(__name__)

    with app.app_context():
        with pytest.raises(ValueError):
            CVParserService.parse("sample resume")


# -------------------------
# SUCCESSFUL PARSE
# -------------------------

@patch("app.services.cv_parser_service.requests.post")
def test_parse_success(mock_post, app):

    mock_response = MagicMock()
    mock_response.ok = True
    mock_response.json.return_value = {
        "candidates": [
            {
                "content": {
                    "parts": [
                        {
                            "text": """
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@test.com",
  "skills": ["Python"],
  "language": []
}
"""
                        }
                    ]
                }
            }
        ]
    }

    mock_post.return_value = mock_response

    result = CVParserService.parse("resume text")

    assert result["first_name"] == "John"
    assert result["email"] == "john@test.com"


# -------------------------
# API ERROR
# -------------------------

@patch("app.services.cv_parser_service.requests.post")
def test_parse_api_error(mock_post, app):

    mock_response = MagicMock()
    mock_response.ok = False
    mock_response.status_code = 500
    mock_response.text = "Internal Error"

    mock_post.return_value = mock_response

    with pytest.raises(Exception):
        CVParserService.parse("resume text")


# -------------------------
# MARKDOWN JSON CLEANING
# -------------------------

@patch("app.services.cv_parser_service.requests.post")
def test_parse_with_markdown_json(mock_post, app):

    mock_response = MagicMock()
    mock_response.ok = True
    mock_response.json.return_value = {
        "candidates": [
            {
                "content": {
                    "parts": [
                        {
                            "text": """```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@test.com",
  "skills": ["Flask"],
  "language": []
}
```"""
                        }
                    ]
                }
            }
        ]
    }

    mock_post.return_value = mock_response

    result = CVParserService.parse("resume text")

    assert result["first_name"] == "Jane"
    assert result["email"] == "jane@test.com"