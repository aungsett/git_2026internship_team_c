export interface Application {
	id: number;
	full_name: string;
	email: string;
	phone_number?: string | null;
	qualification?: string | null;
	work_experience?: number | null;
	preferred_japanese_course?: string | null;
	status: string;
	created_at: string;
	job_id: string;
	job_title: string;
}

export type SortOrder = "newest" | "oldest";
export type StatusType = "Pending" | "Shortlisted" | "Rejected" | "Interviewed";

export interface Applicant {
	applicant_id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string | null;

	skills: string[] | null;
	professional_summary: string | null;

	comments: string | null;

	created_at: Date;
	date_of_birth: string | null;

	work_experience: number | null;
	qualification: string | null;
	address: string | null;
	college: string | null;
	status: StatusType;
	preferred_japanese_course: string | null;

	language: string[] | null;
	social_links: string[] | null;
	document_url: string;
	review: any;

	job_id: string;
	job_title: string;
}

export interface Job {
	id: number;

	// Business ID
	job_id: string;

	// Basic Info
	title: string;
	description: string;
	location: string;

	// Additional Details
	employment_type: string;
	department?: string | null;
	salary_range?: string | null;
	experience_required?: number | null;
	skills?: string[] | null;
	application_deadline?: string | null; // ISO string from backend

	// Status
	status: "Published" | "Draft";

	// Timestamps
	created_at: string;
	updated_at?: string | null;
}
