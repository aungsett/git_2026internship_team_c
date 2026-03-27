"use client";

import { ApiError, fetchApplicantDetails } from "@/lib/data";
import { Applicant } from "@/lib/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useApplicantDetails = (id: string) => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [applicant, setApplicant] = useState<Applicant>({} as Applicant);
	useEffect(() => {
		const loadApplications = async () => {
			try {
				const result = await fetchApplicantDetails(id);
				setApplicant(result);
			} catch (err: any) {
				if (err instanceof ApiError && err.status === 401) {
					router.push("/login");
					return;
				}
				setError(err.message || "Failed to load application details");
			} finally {
				setLoading(false);
			}
		};

		loadApplications();
	}, [id, router]);
	return { loading, error, applicant };
};
