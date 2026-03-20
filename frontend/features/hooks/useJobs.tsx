"use client";

import { useState, useEffect } from "react";
import { filterJobs, FilterOptions } from "@/lib/filter-jobs";
import { api } from "@/lib/api";
export interface Job {
	id: number;
	job_id: string;
	title: string;
	location: string;
	employment_type: string;
	department: string;
	salary_range: string;
	status: string;
	description: string;
	experience_required: number;
}
export const useJobs = () => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [filters, setFilters] = useState<FilterOptions>({
		searchQuery: "",
		departments: [],
		employmentTypes: [],
		salaryRange: [20, 200],
		minExperience: 0,
	});

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
		setFilters((prev) => ({ ...prev, searchQuery: query }));
		setCurrentPage(1);
	};

	const handleFiltersChange = (newFilters: FilterOptions) => {
		setFilters(newFilters);
		setCurrentPage(1);
	};

	const ITEMS_PER_PAGE = 5;

	useEffect(() => {
		const fetchJobs = async () => {
			try {
				const data = await api.getAllJobs();
				setJobs(data.data);
			} catch (err: any) {
				setError(err.message || "Failed to load jobs");
			} finally {
				setLoading(false);
			}
		};

		fetchJobs();
	}, []);
	return {
		error,
		loading,
		searchQuery,
		handleSearchChange,
		filters,
		jobs,
		handleFiltersChange,
		ITEMS_PER_PAGE,
		filterJobs,
		currentPage,
		setCurrentPage,
	};
};
