"use client";

import { useEffect, useState } from "react";
import { getStats } from "@/lib/data"; // your API function
import { ApiError } from "@/lib/data";

export const STATUS_COLORS: Record<string, string> = {
	Pending: "#93c5fd", // blue-300 (lightest)
	Interviewed: "#60a5fa", // blue-400
	Shortlisted: "#3b82f6", // blue-500 (primary highlight)
	Rejected: "#1d4ed8", // blue-700 (darkest)
};

type StatsData = {
	totalApplicants: number;
	statusCounts: {
		Pending: number;
		Shortlisted: number;
		Rejected: number;
		Interviewed: number;
	};

	applicationsOverTime: {
		date: string;
		count: number;
	}[];

	dropOffFunnel: {
		stage: string;
		count: number;
	}[];

	conversionFunnel: {
		stage: string;
		count: number;
	}[];
};

export const useAdminStats = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [data, setData] = useState<StatsData | null>(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const result = await getStats();
				setData(result);
			} catch (err: any) {
				if (err instanceof ApiError && err.status === 401) {
					window.location.href = "/login";
					return;
				}
				setError(err.message || "Failed to load stats");
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	const total = data?.totalApplicants || 1; // prevent divide by 0

	// 🎯 KPI Metrics
	const shortlisted = data?.statusCounts.Shortlisted || 0;
	const rejected = data?.statusCounts.Rejected || 0;
	const interviewed = data?.statusCounts.Interviewed || 0;
	const pending = data?.statusCounts.Pending || 0;

	// Percentages
	const selectionRate = ((shortlisted / total) * 100).toFixed(1);
	const rejectionRate = ((rejected / total) * 100).toFixed(1);
	const interviewRate = ((interviewed / total) * 100).toFixed(1);

	// 🎯 Pie Data (with %)
	const statusPieData = Object.entries(data?.statusCounts || {}).map(
		([key, value]) => ({
			name: key,
			value,
			percent: ((value / total) * 100).toFixed(1),
		}),
	);

	// 🎯 Funnel Conversion (REAL progression)
	const conversionFunnel = [
		{ stage: "Applied", value: total },
		{ stage: "Pending", value: pending },
		{ stage: "Interviewed", value: interviewed },
		{ stage: "Shortlisted", value: shortlisted },
	];

	// 🎯 Drop-off (LOSS at each stage)
	const dropOffFunnel = [
		{ stage: "Pending → Interviewed", loss: pending - interviewed },
		{ stage: "Interviewed → Shortlisted", loss: interviewed - shortlisted },
		{ stage: "Shortlisted → Rejected", loss: shortlisted - rejected },
	];

	// 🎯 Return everything clean
	return {
		loading,
		error,

		totalApplicants: total,
		selectionRate,
		rejectionRate,
		interviewRate,

		statusPieData,
		applicationsLineData: data?.applicationsOverTime || [],
		conversionFunnel,
		dropOffFunnel,
	};
};
