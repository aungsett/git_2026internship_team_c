export interface Application {
	applicant_id: number;
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
