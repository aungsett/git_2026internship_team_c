"use client";
import { SearchBar } from "@/features/job/search-bar";
import { JobFilters } from "@/features/job/job-filters";
import { JobResults } from "@/features/job/job-results";
import { useJobs } from "@/features/hooks/useJobs";
import { useMemo } from "react";

export default function Page() {
	const {
		error,
		loading,
		searchQuery,
		handleSearchChange,
		filters,
		handleFiltersChange,
		currentPage,
		filterJobs,
		jobs,
		setCurrentPage,
		ITEMS_PER_PAGE,
	} = useJobs();
	const filteredJobs = useMemo(() => {
		return filterJobs(jobs, filters);
	}, [filters, jobs]);
	if (error) {
		return (
			<main className="min-h-screen px-10 py-10">
				<p className="text-red-500">{error}</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen">
			{/* Header */}
			<div className="bg-blue-700 text-white py-8 px-4">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl font-bold mb-2">Job Listings</h1>
					<p className="text-primary-foreground/80">
						Find your next opportunity with our comprehensive job
						search
					</p>
				</div>
			</div>

			{loading ? (
				<p className="max-w-7xl mx-auto px-4 py-8 text-slate-500">
					Loading jobs...
				</p>
			) : (
				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="mb-8">
						<SearchBar
							value={searchQuery}
							onChange={handleSearchChange}
						/>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
						<div className="lg:col-span-1">
							<JobFilters
								filters={filters}
								onFiltersChange={handleFiltersChange}
							/>
						</div>

						<div className="lg:col-span-3">
							<JobResults
								jobs={filteredJobs}
								currentPage={currentPage}
								onPageChange={setCurrentPage}
								itemsPerPage={ITEMS_PER_PAGE}
								totalResults={filteredJobs.length}
							/>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
