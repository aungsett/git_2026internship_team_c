import re

EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
ALLOWED_EXTENSIONS = {'pdf'}
MAX_FILE_SIZE_MB = 5

def validate_email(email):
    """Returns True if email format is valid"""
    return bool(re.match(EMAIL_REGEX, email))

def validate_file_type(filename):
    """Returns True if file is a PDF"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_file_size(file):
    """
    Returns True if file < 2MB.
    Note: file.seek(0, 2) moves cursor to end to get size, 
    then file.seek(0) resets it so we can read it again later.
    """
    file.seek(0, 2) # Move to end
    size = file.tell() # Get position (size in bytes)
    file.seek(0) # Reset to start
    
    limit_bytes = MAX_FILE_SIZE_MB * 1024 * 1024
    return size <= limit_bytes
