# ATS Portal - Team C

An Applicant Tracking System for managing job listings, applications, and candidate reviews. Applicants can browse open positions, submit applications with CV uploads, and receive confirmation emails. Admins can review, shortlist, and manage applications from a dedicated dashboard.

## Tech Stack

- **Backend:** Python, Flask, PostgreSQL (Neon), Firebase Auth, Cloudinary
- **Frontend:** Next.js, TypeScript, Tailwind CSS, shadcn/ui

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- A `.env` file in `/backend` with the following variables:
```
DATABASE_URL=
FIREBASE_CREDENTIALS=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
MAIL_USERNAME=
MAIL_PASSWORD=
COOKIE_SECURE=false
COOKIE_SAMESITE=Lax
COOKIE_DOMAIN=
SESSION_COOKIE_NAME=session
CSRF_COOKIE_NAME=csrf_token
CSRF_HEADER_NAME=X-CSRF-Token
```

## Backend Setup
```sh
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
python seed.py
python run.py
```

Backend runs on `http://localhost:5000`

## Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Project Structure
```
/backend     → Flask API, models, services, migrations
/frontend    → Next.js app, components, features
```
