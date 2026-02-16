from app import create_app
from app.extensions import db
from app.models.admin import Admin
from datetime import datetime

app = create_app()

def seed_admins():
    with app.app_context():

        now = datetime.utcnow()

        admins = [
	    {
                "firebase_uid": "rZ6ILohNWjbUZyalB0bfkJI43Nn2",
                "username": "Chaitanya Patil",
                "email": "chaitanyapatil.xe@gmail.com",
                "created_at": now
            },
            {
                "firebase_uid": "8BDoGiGsIfeStBQ8YzWNuLGaAVJ2",
                "username": "Anushree Jaiswal",
                "email": "anushreejaiswal.srn@gmail.com",
                "created_at": now
            },
            {
                "firebase_uid": "fs1Uw1b2dqd6DJTtMHwfcQtZpuk2",
                "username": "Pakhi Sharma",
                "email": "paksh2004@gmail.com",
                "created_at": now
            },
            {
                "firebase_uid": "rCTtxdPzWrgIq6thOPKnmb4xnwW2",
                "username": "Aditya Kumar",
                "email": "adityadav294@gmail.com",
                "created_at": now
            },
            {
                "firebase_uid": "3fb3a1x746PknalD6jHl4yOQ0yn1",
                "username": "Shubham Sahay",
                "email": "shubhamsahay83@gmail.com",
                "created_at": now
            }
        ]

        for data in admins:
            existing_admin = Admin.query.filter_by(email=data["email"]).first()

            if not existing_admin:
                new_admin = Admin(
                    firebase_uid=data["firebase_uid"],
                    username=data["username"],
                    email=data["email"],
                    role="admin",
                    created_at=data["created_at"]
                )
                db.session.add(new_admin)
                print(f"   Added: {data['username']}")
            else:
                print(f"   Skipped: {data['username']} (Already exists)")

        db.session.commit()
        print("Database Seeding Complete!")

if __name__ == "__main__":
    seed_admins()
