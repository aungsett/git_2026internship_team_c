import { useState } from "react";
import { StatusType } from "@/lib/types";
import { updateReview } from "@/lib/data";

interface ReviewPayload {
	applicant_id: number;
	job_id: string;
}

export const useReviewApplicant = (initialStatus: StatusType) => {
	const [appStatus, setAppStatus] = useState<StatusType>(initialStatus);
	const [originalStatus, setOriginalStatus] =
		useState<StatusType>(initialStatus);
	const [loading, setLoading] = useState(false);
	const hasChanged = appStatus !== originalStatus;

	const handleSave = async ({ applicant_id, job_id }: ReviewPayload) => {
		if (!hasChanged) return;
		setLoading(true);
		let status = appStatus;
		try {
			await updateReview({ applicant_id, job_id, status });
			setOriginalStatus(status);
		} catch (err: any) {
			console.error(err);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		appStatus,
		setAppStatus,
		handleSave,
		hasChanged,
		loading,
	};
};
