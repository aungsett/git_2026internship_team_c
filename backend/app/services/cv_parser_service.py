import json
import requests
from flask import current_app

PROMPT = """You are an expert AI Resume Parsing Engine used inside an Applicant Tracking System (ATS).
Your task is to analyze the provided resume text and extract structured applicant information. 
The resume may contain unstructured text, different formats, tables, bullet points, or sections. 
You must interpret the content accurately and extract only the relevant information.
STRICT RULES:
1. Return ONLY valid JSON. Do not include explanations or comments.
2. Do not hallucinate or invent information.
3. If a field is missing in the resume, return null.
4. Arrays must always be returned for skills, language, and social_links even if empty.
5. Extract information exactly as it appears in the resume whenever possible.
6. Normalize phone numbers and emails if possible.
7. Work experience should be the total number of years of professional experience if mentioned. If unclear, estimate from job history dates if available. don't include internships
8. Skills should include technical, programming, and professional skills found in the resume.
9. Languages should include spoken or written languages mentioned by the applicant.
FIELDS TO EXTRACT:
first_name: Applicant's first name.
last_name: Applicant's last name.
date_of_birth: Date of birth if explicitly mentioned.
email: Primary email address found in the resume.
address: Location such as city, state, or country.
phone_number: Primary contact number.
qualification: Highest educational qualification (e.g., B.Tech, MBA, MSc).
college: Name of the college or university of the highest qualification.
work_experience: Total years of professional work experience as a number.
skills: List of technical or professional skills found in the resume.
professional_summary: Generate a concise 2-3 sentence professional summary describing the candidate's background, expertise, and key strengths based on the resume.
language: List of languages known by the applicant.
OUTPUT FORMAT (STRICT JSON):
{
  "first_name": "",
  "last_name": "",
  "date_of_birth": "",
  "email": "",
  "address": "",
  "phone_number": "",
  "qualification": "",
  "college": "",
  "work_experience": null,
  "skills": [],
  "professional_summary": "",
  "language": []
}
Resume Text:"""


class CVParserService:
    @staticmethod
    def parse(resume_text: str) -> dict:
        api_key = current_app.config.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY is not configured")

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key={api_key}"

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": PROMPT + "\n" + resume_text
                        }
                    ]
                }
            ]
        }

        response = requests.post(url, json=payload)

        if not response.ok:
            raise Exception(f"Gemini API error: {response.status_code} {response.text}")

        result = response.json()

        raw_text = result["candidates"][0]["content"]["parts"][0]["text"]

        # Strip markdown code fences if present
        clean = raw_text.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        clean = clean.strip()

        parsed = json.loads(clean)
        return parsed
