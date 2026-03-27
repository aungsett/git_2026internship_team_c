import { Application } from "./types";
import { getCsrfToken } from "./security";

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
	const response = await fetch(`${BASE_URL}/admin/applications`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

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

export const fetchApplicantDetails = async (id: string): Promise<any> => {
	const response = await fetch(`${BASE_URL}/admin/applications/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	const result = await response.json();
	console.log(result, " result");

	if (!response.ok || !result.success) {
		throw new ApiError(
			result.error || "Failed to fetch applicant details",
			response.status,
		);
	}

	return result.data;
};

export const fetchAdminJobs = async (): Promise<any> => {
	const response = await fetch(`${BASE_URL}/admin/jobs`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});
	const result = await response.json();
	if (!response.ok || !result.success) {
		throw new ApiError(
			result.error || "Failed to fetch jobs",
			response.status,
		);
	}

	return result.data;
};

export const updateReview = async ({
	job_id,
	status,
	applicant_id,
}: {
	job_id: string;
	status: string;
	applicant_id: number;
}): Promise<any> => {
	const adminData = localStorage.getItem("admin");
	const adminId = adminData ? JSON.parse(adminData).admin_id : null;

	if (!adminId) {
		console.error("Admin not found in localStorage");
		return;
	}

	const csrfToken = getCsrfToken();
	const res = await fetch(
		`${BASE_URL}/admin/applications/${applicant_id}/review`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
			},
			body: JSON.stringify({
				job_id: job_id,
				status: status,
				admin_id: adminId,
			}),
			credentials: "include",
		},
	);

	const data = await res.json();

	if (!res.ok) {
		throw new ApiError(data.error || "Failed to update status", res.status);
	}

	return data;
};

export const getStats = async (): Promise<any> => {
	const response = await fetch(`${BASE_URL}/admin/stats`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});
	const result = await response.json();
	if (!response.ok || !result.success) {
		throw new ApiError(
			result.error || "Failed to fetch stats",
			response.status,
		);
	}

	return result.data;
};
