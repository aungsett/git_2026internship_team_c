"use client";
import { Button } from "@/components/ui/button";
import { Application, Job } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	filteredApplications?: Application[];
	filteredJobs?: Job[];
	startIdx: number;
	endIdx: number;
	currentPage: number;
	itemsPerPage: number;
	setCurrentPage: (page: number) => void;
}

export const Pagination = ({
	filteredApplications,
	filteredJobs,
	startIdx,
	endIdx,
	currentPage,
	itemsPerPage,
	setCurrentPage,
}: PaginationProps) => {
	const totalPages = Math.ceil(
		(filteredApplications?.length || filteredJobs?.length || 0) /
			itemsPerPage,
	);
	return (
		<div className="mt-6 flex items-center justify-between">
			<p className="text-sm text-gray-600">
				Showing{" "}
				{(filteredApplications?.length || filteredJobs?.length || 0) > 0
					? startIdx + 1
					: 0}
				-
				{Math.min(
					endIdx,
					filteredApplications?.length || filteredJobs?.length || 0,
				)}{" "}
				of {filteredApplications?.length || filteredJobs?.length || 0}{" "}
				{filteredApplications?.length ? "applications" : "jobs"}
			</p>
			<div className="flex items-center gap-1">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
					disabled={currentPage === 1}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				{Array.from({ length: totalPages }, (_, i) => i + 1)
					.slice(
						Math.max(0, currentPage - 2),
						Math.min(totalPages, currentPage + 1),
					)
					.map((page) => (
						<Button
							key={page}
							variant={
								page === currentPage ? "default" : "outline"
							}
							size="sm"
							onClick={() => setCurrentPage(page)}
							className={
								page === currentPage ? "bg-blue-600" : ""
							}
						>
							{page}
						</Button>
					))}
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						setCurrentPage(Math.min(totalPages, currentPage + 1))
					}
					disabled={currentPage === totalPages}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
};
