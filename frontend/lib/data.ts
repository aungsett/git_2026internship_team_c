import { Application } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchApplications = async (
	token: string,
	page: number = 1,
	perPage: number = 100
): Promise<{ data: Application[]; total: number; pages: number }> => {
	const response = await fetch(
		`${BASE_URL}/admin/applications?page=${page}&per_page=${perPage}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);

	const result = await response.json();

	if (!result.success) {
		throw new Error(result.error || "Failed to fetch applications");
	}

	return {
		data: result.data,
		total: result.total,
		pages: result.pages,
	};
};
