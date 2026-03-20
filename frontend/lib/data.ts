import { Applicant } from "@/features/types/applicant";
import { Application } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

export const fetchApplications = async (
	page: number = 1,
	perPage: number = 100,
): Promise<{ data: Application[]; total: number; pages: number }> => {
	const response = await fetch(
		`${BASE_URL}/admin/applications?page=${page}&per_page=${perPage}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		},
	);

	const result = await response.json();

	if (!response.ok || !result.success) {
		throw new ApiError(
			result.error || "Failed to fetch applications",
			response.status,
		);
	}

	return {
		data: result.data,
		total: result.total,
		pages: result.pages,
	};
};

export const fetchApplicantDetails = async (
	id: string,
): Promise<any> => {
	const response = await fetch(`${BASE_URL}/admin/applications/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	const result = await response.json();

	if (!response.ok || !result.success) {
		throw new ApiError(
			result.error || "Failed to fetch applicant details",
			response.status,
		);
	}

	return result.data;
};
