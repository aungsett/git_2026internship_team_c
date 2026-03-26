"use client";
import { Loader } from "@/components/landing/loader";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/features/admin/components/pagination";
import { useJoblisting } from "@/features/hooks/useJobListing";
import { FilterBar } from "@/features/job/filter-bar";
import { JobsTable } from "@/features/job/jobs-table";

export default function Page() {
	const {
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
	} = useJoblisting();
	if (error) {
		return (
			<main className="min-h-screen bg-gray-50 flex items-center justify-center">
				<p className="text-red-500">{error}</p>
			</main>
		);
	}
	return (
		<main className="min-h-screen px-10 py-4 flex flex-col gap-4">
			<div className="">
				{/* Header */}
				<div className="mb-8 flex items-start justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Jobs Management
						</h1>
						<p className="mt-2 text-gray-600">
							Design and deploy high-impact roles. Manage your
							organization's architectural talent pipeline with
							precision.
						</p>
					</div>
				</div>

				{/* Filters Section */}
				<FilterBar
					search={search}
					setSearch={setSearch}
					status={status}
					setStatus={setStatus}
					experience={experience}
					setExperience={setExperience}
					department={department}
					setDepartment={setDepartment}
					employmentType={employmentType}
					setEmploymentType={setEmploymentType}
					sort={sort}
					setSort={setSort}
					handleReset={handleReset}
					jobs={jobs}
				/>

				{loading ? (
					<Loader />
				) : (
					<>
						{/* Results Badge */}
						<div className="mb-6 flex items-center gap-2">
							<span className="text-sm text-gray-600">
								Showing
							</span>
							<Badge variant="default" className="bg-blue-600">
								{filteredJobs.length}
							</Badge>
							<span className="text-sm text-gray-600">
								of {jobs.length} applications
							</span>
						</div>
						{/* Table */}
						<JobsTable
							filteredJobs={filteredJobs}
							startIdx={startIdx}
							endIdx={endIdx}
						/>

						{/* Pagination Footer */}
						<Pagination
							filteredJobs={filteredJobs}
							startIdx={startIdx}
							endIdx={endIdx}
							currentPage={currentPage}
							itemsPerPage={itemsPerPage}
							setCurrentPage={setCurrentPage}
						/>
					</>
				)}
			</div>
		</main>
	);
}
