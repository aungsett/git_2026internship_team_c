"use client";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterBar } from "./filterbar";
import { ApplicantsSheet } from "./applicants-sheet";
import { Pagination } from "./pagination";
import { useAdmin } from "@/features/hooks/useAdmin";

export default function ApplicationsPage() {
	const {
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
	} = useAdmin();

	if (error) {
		return (
			<main className="min-h-screen bg-gray-50 flex items-center justify-center">
				<p className="text-red-500">{error}</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-gray-50">
			<div className="">
				{/* Header */}
				<div className="mb-8 flex items-start justify-between">
					<div>
						<h1 className="text-4xl font-bold text-gray-900">
							Applications Overview
						</h1>
						<p className="mt-2 text-gray-600">
							Review and manage recent job applications
						</p>
					</div>
					<Button
						onClick={handleExportCSV}
						className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
					>
						<Download className="h-4 w-4" />
						Export CSV
					</Button>
				</div>

				{/* Filters Section */}
				<FilterBar
					search={search}
					setSearch={setSearch}
					qualification={qualification}
					setQualification={setQualification}
					experience={experience}
					setExperience={setExperience}
					course={course}
					setCourse={setCourse}
					sort={sort}
					setSort={setSort}
					handleReset={handleReset}
					applications={applications}
				/>

				{/* Results Badge */}
				<div className="mb-6 flex items-center gap-2">
					<span className="text-sm text-gray-600">Showing</span>
					<Badge variant="default" className="bg-blue-600">
						{filteredApplications.length}
					</Badge>
					<span className="text-sm text-gray-600">
						of {applications.length} applications
					</span>
				</div>

				{loading && (
					<div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
						Loading latest applications...
					</div>
				)}

				{/* Table */}
				<ApplicantsSheet
					filteredApplications={filteredApplications}
					startIdx={startIdx}
					endIdx={endIdx}
				/>

				{/* Pagination Footer */}
				<Pagination
					filteredApplications={filteredApplications}
					startIdx={startIdx}
					endIdx={endIdx}
					currentPage={currentPage}
					itemsPerPage={itemsPerPage}
					setCurrentPage={setCurrentPage}
				/>
			</div>
		</main>
	);
}
