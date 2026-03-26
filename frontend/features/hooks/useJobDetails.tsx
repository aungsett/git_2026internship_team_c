"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
	MapPin,
	Briefcase,
	Calendar,
	DollarSign,
	Clock,
	Building2,
} from "lucide-react";

export interface Job {
	id: number;
	job_id: string;

	title: string;
	description: string;

	location: string | null;
	employment_type: string | null;
	department: string | null;

	salary_range: string | null;
	experience_required: number | null;

	skills: string[] | [];

	application_deadline: string | null;

	status: string;

	created_at: string;
	updated_at: string | null;
}

export const formatDate = (dateString: string): string => {
	const date = new Date(dateString);

	return date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
};

export const useJobDetails = () => {
	const [jobDetails, setJobDetails] = useState<Job>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const pathname = usePathname();
	const extractJobId = (segment: string): string | null => {
		const decoded = decodeURIComponent(segment);

		const parts = decoded.split("-job-id-");

		if (parts.length < 2) return null;

		return parts[1].toUpperCase();
	};

	useEffect(() => {
		const fetchJobs = async () => {
			try {
				const data = await api.getSingleJob(
					extractJobId(pathname) + "",
				);
				setJobDetails(data.data);
			} catch (err: any) {
				setError(err.message || "Failed to load jobs");
			} finally {
				setLoading(false);
			}
		};

		fetchJobs();
	}, []);
	const details = [
		{
			icon: MapPin,
			label: "LOCATION",
			value: jobDetails?.location,
		},
		{
			icon: Briefcase,
			label: "EMPLOYMENT TYPE",
			value: jobDetails?.employment_type,
		},
		{
			icon: Building2,
			label: "DEPARTMENT",
			value: jobDetails?.department,
		},
		{
			icon: DollarSign,
			label: "SALARY RANGE",
			value: jobDetails?.salary_range,
		},
		{
			icon: Clock,
			label: "EXPERIENCE REQUIRED",
			value: jobDetails?.experience_required + " year(s)",
		},
		{
			icon: Calendar,
			label: "DEADLINE",
			value: formatDate(jobDetails?.application_deadline + "") + "",
		},
	];
	const expired =
		new Date(jobDetails?.application_deadline + "").getTime() < Date.now();
	return { jobDetails, loading, error, details, expired, pathname };
};
