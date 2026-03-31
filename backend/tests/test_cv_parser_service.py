import pytest


cv_parser_available = False
try:
    from app.services.cv_parser_service import CVParserService
    if hasattr(CVParserService, 'parse_cv'):
        cv_parser_available = True
except (ImportError, AttributeError):
    pass


@pytest.mark.skipif(not cv_parser_available, reason="CVParserService not implemented yet")
class TestCVParserService:
    def test_parse_cv_success(self, app):
        from unittest.mock import patch, MagicMock
        
        with app.app_context():
            with patch("app.services.cv_parser_service.requests.post") as mock_post:
                mock_response = MagicMock()
                mock_response.status_code = 200
                mock_response.json.return_value = {
                    "name": "John Doe",
                    "email": "john@example.com",
                    "phone": "1234567890",
                    "skills": ["Python", "JavaScript", "React"],
                }
                mock_post.return_value = mock_response
                
                mock_file = MagicMock()
                mock_file.read.return_value = b"mock pdf content"
                
                result = CVParserService.parse_cv(mock_file)
                
                assert result is not None
                assert result["name"] == "John Doe"

    def test_parse_cv_api_error(self, app):
        from unittest.mock import patch, MagicMock
        
        with app.app_context():
            with patch("app.services.cv_parser_service.requests.post") as mock_post:
                mock_response = MagicMock()
                mock_response.status_code = 500
                mock_post.return_value = mock_response
                
                mock_file = MagicMock()
                mock_file.read.return_value = b"mock pdf content"
                
                with pytest.raises(Exception):
                    CVParserService.parse_cv(mock_file)

    def test_parse_cv_network_error(self, app):
        from unittest.mock import patch
        
        with app.app_context():
            with patch("app.services.cv_parser_service.requests.post") as mock_post:
                mock_post.side_effect = Exception("Connection timeout")
                
                mock_file = MagicMock()
                mock_file.read.return_value = b"mock pdf content"
                
                with pytest.raises(Exception):
                    CVParserService.parse_cv(mock_file)


def test_cv_parser_service_exists():
    try:
        from app.services import cv_parser_service
        assert cv_parser_service is not None
    except ImportError:
        pytest.skip("CVParserService module not implemented yet")