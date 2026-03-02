# Team C
# Team C

## Project Overview
This repository contains a full-stack application with a Python (Flask) backend and a Next.js frontend. The backend manages authentication, job postings, and applicant data, while the frontend provides a user interface for job seekers and administrators.

---

## Getting Started

### 1. Clone the Repository
```sh
git clone <repo-url>
cd <repo-folder>
```

---

## Backend Setup

### 2. Create and Activate Virtual Environment (Windows)
```sh
cd backend
python -m venv venv
.\venv\Scripts\activate
```

### 3. Install Dependencies
```sh
pip install -r requirements.txt
# If you see missing package errors, install them manually:
pip install firebase-admin cloudinary
```

### 4. Start Backend Server
```sh
python run.py
```

---

## Frontend Setup

### 5. Install Dependencies
```sh
cd frontend
npm install
```

### 6. Start Frontend Server
```sh
npm run dev
```

---

## Accessing the Application
- Backend: http://localhost:5000 (or as configured in run.py)
- Frontend: http://localhost:3000

---
