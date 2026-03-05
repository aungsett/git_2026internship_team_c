import { Document } from "./document";

export interface Application {
	applicant_id: number;

	first_name: string;
	last_name: string;

	email: string;
	phone_number?: string | null;

	skills?: string[] | null;

	summary?: string | null;

	created_at?: string | null; // ISO date string
}

export interface Applicant {
	applicant_id: number;

	// Basic Info
	first_name: string;
	last_name: string;
	date_of_birth?: string | null; // ISO string
	email: string;
	address?: string | null;
	phone_number?: string | null;

	// Education / Career
	qualification?: string | null;
	college?: string | null;
	work_experience?: number | null;

	// Course Preference
	preferred_japanese_course?: string | null;

	// Arrays (Postgres ARRAY → TS array)
	skills?: string[] | null;
	language?: string[] | null;
	social_links?: string[] | null;

	// AI Parsed Fields
	professional_summary?: string | null;
	comments?: string | null;

	created_at?: string | null;

	document?: Document | null;
}
