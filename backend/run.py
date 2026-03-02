from app import create_app
from app.firebase_config import initialize_firebase

initialize_firebase()
app = create_app()

if __name__ == "__main__":
    app.run(port=5000)
