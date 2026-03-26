"use client";

import { Job, SortOrder } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { ApiError, fetchAdminJobs } from "@/lib/data";
import { useRouter } from "next/navigation";

const filterAndSortJobs = (
	jobs: Job[],
	search: string,
	status: string,
	experience: string,
	department: string,
	employmentType: string,
	sort: SortOrder,
): Job[] => {
	let filtered = jobs.filter((job) => {
		const searchLower = search.toLowerCase();

		const matchesSearch =
			job.title.toLowerCase().includes(searchLower) ||
			job.location.toLowerCase().includes(searchLower);

		const matchesStatus = status === "any" || job.status === status;

		const matchesExperience =
			experience === "any" ||
			String(job.experience_required ?? "") === experience;

		const matchesDepartment =
			department === "any" || job.department === department;

		const matchesEmploymentType =
			employmentType === "any" || job.employment_type === employmentType;

		return (
			matchesSearch &&
			matchesStatus &&
			matchesExperience &&
			matchesDepartment &&
			matchesEmploymentType
		);
	});

	filtered.sort((a, b) => {
		const dateA = new Date(a.created_at).getTime();
		const dateB = new Date(b.created_at).getTime();

		return sort === "newest" ? dateB - dateA : dateA - dateB;
	});

	return filtered;
};

export const useJoblisting = () => {
	const router = useRouter();

	const [jobs, setJobs] = useState<Job[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("any");
	const [experience, setExperience] = useState("any");
	const [department, setDepartment] = useState("any");
	const [employmentType, setEmploymentType] = useState("any");

	const [sort, setSort] = useState<SortOrder>("newest");

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	useEffect(() => {
		const loadJobs = async () => {
			try {
				const result = await fetchAdminJobs();
				// console.log(result);
				setJobs(result);
			} catch (err: any) {
				if (err instanceof ApiError && err.status === 401) {
					router.push("/login");
					return;
				}
				setError(err.message || "Failed to load jobs");
			} finally {
				setLoading(false);
			}
		};

		loadJobs();
	}, [router]);

	const filteredJobs = useMemo(() => {
		return filterAndSortJobs(
			jobs,
			search,
			status,
			experience,
			department,
			employmentType,
			sort,
		);
	}, [jobs, search, status, experience, department, employmentType, sort]);

	const startIdx = (currentPage - 1) * itemsPerPage;
	const endIdx = startIdx + itemsPerPage;

	useEffect(() => {
		setCurrentPage(1);
	}, [search, status, experience, department, employmentType, sort]);

	const handleReset = () => {
		setSearch("");
		setStatus("any");
		setExperience("any");
		setDepartment("any");
		setEmploymentType("any");
		setSort("newest");
		setCurrentPage(1);
	};
	return {
		jobs,
		loading,
		error,
		search,
		setSearch,
		status,
		setStatus,
		experience,
		setExperience,
		department,
		setDepartment,
		employmentType,
		setEmploymentType,
		sort,
		setSort,
		currentPage,
		setCurrentPage,
		filteredJobs,
		startIdx,
		endIdx,
		handleReset,
		itemsPerPage,
	};
};
