"use client";
import { Application, SortOrder } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { ApiError, fetchApplications } from "@/lib/data";
import { useRouter } from "next/navigation";

const filterAndSortApplications = (
	apps: Application[],
	search: string,
	qualification: string,
	experience: string,
	course: string,
	sort: SortOrder,
): Application[] => {
	let filtered = apps.filter((app) => {
		const searchLower = search.toLowerCase();

		const matchesSearch =
			app.full_name.toLowerCase().includes(searchLower) ||
			app.email.toLowerCase().includes(searchLower) ||
			app.job_id.toLowerCase().includes(searchLower) ||
			app.job_title.toLowerCase().includes(searchLower);

		const matchesQualification =
			qualification === "any" || app.qualification === qualification;

		const matchesExperience =
			experience === "any" ||
			String(app.work_experience ?? "").includes(experience);

		const matchesCourse =
			course === "any" || app.preferred_japanese_course === course;

		return (
			matchesSearch &&
			matchesQualification &&
			matchesExperience &&
			matchesCourse
		);
	});

	filtered.sort((a, b) => {
		const dateA = new Date(a.created_at).getTime();
		const dateB = new Date(b.created_at).getTime();
		return sort === "newest" ? dateB - dateA : dateA - dateB;
	});

	return filtered;
};

export const useAdmin = () => {
	const router = useRouter();
	const [applications, setApplications] = useState<Application[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [qualification, setQualification] = useState("any");
	const [experience, setExperience] = useState("any");
	const [course, setCourse] = useState("any");
	const [sort, setSort] = useState<SortOrder>("newest");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	useEffect(() => {
		const loadApplications = async () => {
			try {
				const result = await fetchApplications();
				setApplications(result.data);
			} catch (err: any) {
				if (err instanceof ApiError && err.status === 401) {
					router.push("/login");
					return;
				}
				setError(err.message || "Failed to load applications");
			} finally {
				setLoading(false);
			}
		};

		loadApplications();
	}, [router]);

	const filteredApplications = useMemo(() => {
		return filterAndSortApplications(
			applications,
			search,
			qualification,
			experience,
			course,
			sort,
		);
	}, [applications, search, qualification, experience, course, sort]);

	const startIdx = (currentPage - 1) * itemsPerPage;
	const endIdx = startIdx + itemsPerPage;

	useEffect(() => {
		setCurrentPage(1);
	}, [search, qualification, experience, course, sort]);

	const handleReset = () => {
		setSearch("");
		setQualification("any");
		setExperience("any");
		setCourse("any");
		setSort("newest");
		setCurrentPage(1);
	};

	const handleExportCSV = () => {
		const headers = [
			"Name",
			"Email",
			"Phone",
			"Qualification",
			"Experience",
			"Course",
			"Job ID",
			"Job Title",
			"Status",
			"Applied Date",
		];

		const rows = filteredApplications.map((app) => [
			app.full_name,
			app.email,
			app.phone_number ?? "",
			app.qualification ?? "",
			app.work_experience ?? "",
			app.preferred_japanese_course ?? "",
			app.job_id,
			app.job_title,
			app.status,
			app.created_at,
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) =>
				row
					.map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
					.join(","),
			),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = "applications.csv";
		a.click();

		window.URL.revokeObjectURL(url);
	};

	return {
		applications,
		loading,
		error,
		search,
		setSearch,
		qualification,
		setQualification,
		experience,
		setExperience,
		course,
		setCourse,
		sort,
		setSort,
		currentPage,
		setCurrentPage,
		filteredApplications,
		startIdx,
		endIdx,
		handleReset,
		handleExportCSV,
		itemsPerPage,
	};
};
