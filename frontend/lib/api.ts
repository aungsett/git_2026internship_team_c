import { getCsrfToken } from "./security";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = {
	// Jobs
	getAllJobs: async () => {
		const response = await fetch(`${BASE_URL}/jobs`);
		const data = await response.json();
		if (!data.success) throw new Error(data.error);
		return data;
	},

	getSingleJob: async (id: string) => {
		const response = await fetch(`${BASE_URL}/jobs/${id}`);
		const data = await response.json();
		if (!data.success) throw new Error(data.error);
		return data;
	},

	// Jobs (Admin)
	createJob: async (payload: object) => {
		const csrfToken = getCsrfToken();

		const response = await fetch(`${BASE_URL}/admin/create-jobs`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
			},
			credentials: "include",
			body: JSON.stringify(payload),
		});
		const data = await response.json();
		if (!data.success) throw new Error(data.error);
		return data;
	},

	// Edit Job (Admin)
	updateJob: async (id: number, payload: object) => {
	    const csrfToken = getCsrfToken();
	    const response = await fetch(`${BASE_URL}/admin/jobs/${id}`, {
	        method: "PUT",
	        headers: {
	            "Content-Type": "application/json",
	            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
	        },
	        credentials: "include",
	        body: JSON.stringify(payload),
	    });
	    const data = await response.json();
	    if (!data.success) throw new Error(data.error);
	    return data;
	},
	
	// Delete Job (Admin)
	deleteJob: async (id: number) => {
	    const csrfToken = getCsrfToken();
	    const response = await fetch(`${BASE_URL}/jobs/${id}`, {
	        method: "DELETE",
	        headers: {
	            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
	        },
	        credentials: "include",
	    });
	    const data = await response.json();
	    if (!data.success) throw new Error(data.error);
	    return data;
	},

	// Applicant
	submitApplication: async (formData: FormData) => {
		const response = await fetch(`${BASE_URL}/applicant/submit`, {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		if (!data.success) throw new Error(data.error);
		return data;
	},

	// CV Parsing
	parseCV: async (resumeText: string) => {
		const response = await fetch(`/api/parse-cv`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ resume_text: resumeText }),
		});
		const data = await response.json();
		if (!data.success) throw new Error(data.error);
		return data;
	},
};
