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
}

export type SortOrder = "newest" | "oldest";
export type StatusType = "Pending" | "Shortlisted" | "Rejected";

export interface Applicant {
	applicant_id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string | null;

	skills: string[] | null;
	summary: string | null;

	created_at: Date;
	date_of_birth: string | null;

	work_experience: number | null;
	qualification: string | null;
	address: string | null;
	college: string | null;

	preferred_japanese_course: string | null;

	language: string[] | null;
	social_links: string[] | null;
	document_url: string;
	review: any;
}
