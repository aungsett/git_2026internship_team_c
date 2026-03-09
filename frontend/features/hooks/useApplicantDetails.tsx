"use client";

import { fetchApplicantDetails } from "@/lib/data";
import { Applicant } from "@/lib/types";
import { useEffect, useState } from "react";

export const useApplicantDetails = (id: string) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [applicant, setApplicant] = useState<Applicant>({} as Applicant);
	useEffect(() => {
		const loadApplications = async () => {
			try {
				const admin = JSON.parse(localStorage.getItem("admin") || "{}");
				const token = admin.token;

				if (!token) {
					setError("Not authenticated");
					return;
				}

				const result = await fetchApplicantDetails(token, id);
				setApplicant(result);
			} catch (err: any) {
				setError(err.message || "Failed to load application details");
			} finally {
				setLoading(false);
			}
		};

		loadApplications();
	}, []);
	return { loading, error, applicant };
};
