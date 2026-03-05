export interface Application {
	id: string;
	name: string;
	email: string;
	phone: string;
	qualification: string;
	experience: string;
	course: string;
	status: "Shortlisted" | "Pending Review" | "Interviewed" | "Rejected";
	appliedDate: Date;
}

export type SortOrder = "newest" | "oldest";

export type StatusType = "Pending" | "Shortlisted" | "Rejected" | "Interviewed";
