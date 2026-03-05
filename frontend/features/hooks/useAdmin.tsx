"use client";

import { Application, SortOrder } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
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
			app.name.toLowerCase().includes(searchLower) ||
			app.email.toLowerCase().includes(searchLower);

		const matchesQualification =
			qualification === "any" || app.qualification === qualification;
		const matchesExperience =
			experience === "any" || app.experience === experience;
		const matchesCourse = course === "any" || app.course === course;

		return (
			matchesSearch &&
			matchesQualification &&
			matchesExperience &&
			matchesCourse
		);
	});

	// Sort by applied date
	filtered.sort((a, b) => {
		const dateA = new Date(a.appliedDate).getTime();
		const dateB = new Date(b.appliedDate).getTime();
		return sort === "newest" ? dateB - dateA : dateA - dateB;
	});

	return filtered;
};
export const useAdmin = ({ applications }: { applications: Application[] }) => {
	const [search, setSearch] = useState("");
	const [qualification, setQualification] = useState("any");
	const [experience, setExperience] = useState("any");
	const [course, setCourse] = useState("any");
	const [sort, setSort] = useState<SortOrder>("newest");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Filter and sort applications
	const filteredApplications = useMemo(() => {
		return filterAndSortApplications(
			applications,
			search,
			qualification,
			experience,
			course,
			sort,
		);
	}, [search, qualification, experience, course, sort]);

	// Pagination
	const startIdx = (currentPage - 1) * itemsPerPage;
	const endIdx = startIdx + itemsPerPage;

	// Reset pagination when filters change
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
			"Status",
			"Applied Date",
		];
		const rows = filteredApplications.map((app) => [
			app.name,
			app.email,
			app.phone,
			app.qualification,
			app.experience,
			app.course,
			app.status,
			app.appliedDate.toLocaleDateString(),
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
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
