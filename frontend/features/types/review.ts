export type ReviewStatus =
	| "Pending"
	| "Shortlisted"
	| "Rejected"
	| "Interviewed";

export interface ApplicationReview {
	review_id: number;

	applicant_id: number;
	admin_id: number;

	status: ReviewStatus;

	comments?: string | null;

	reviewed_at?: string | null; // ISO string
}
