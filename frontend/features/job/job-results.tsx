"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	MapPin,
	DollarSign,
	Briefcase,
	GraduationCap,
	Send,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Job, useJobs } from "../hooks/useJobs";

interface JobResultsProps {
	jobs: Job[];
	currentPage: number;
	onPageChange: (page: number) => void;
	totalResults: number;
	itemsPerPage: number;
}

export const toSlug = (title: string): string => {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-");
};

export const JobResults = ({
	jobs,
	currentPage,
	onPageChange,
	itemsPerPage,
	totalResults,
}: JobResultsProps) => {
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedJobs = jobs.slice(startIndex, endIndex);
	const totalPages = Math.ceil(jobs.length / itemsPerPage);

	const getEmploymentTypeColor = (type: string) => {
		return type === "Full-time"
			? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 hover:cursor-default hover:text-emerald-800"
			: "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:cursor-default hover:text-amber-800";
	};

	return (
		<div className="space-y-6">
			{/* Results Badge */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">
						Results:
					</span>
					<Badge
						variant="outline"
						className="text-blue-600 text-sm px-3 py-1 border-blue-600"
					>
						{totalResults} {totalResults === 1 ? "job" : "jobs"}{" "}
						found
					</Badge>
				</div>
			</div>

			{paginatedJobs.length > 0 ? (
				<div className="flex flex-col gap-4">
					{paginatedJobs.map((job) => (
						<Link
							href={`/jobs/${toSlug(job.title) + "-job-id-" + job.job_id.toLowerCase()}`}
							key={job.id}
							className="w-full"
						>
							<Card
								key={job.id}
								className="p-6 hover:shadow-md transition-shadow"
							>
								<div className="space-y-3 w-full">
									{/* Header */}
									<div className="flex items-start justify-between gap-4 w-full">
										<div className="flex flex-col gap-2 w-full">
											<h3 className="text-2xl font-bold text-foreground">
												{job.title}
											</h3>
											<p className="line-clamp-2 text-sm text-slate-500 max-w-sm">
												{job.description}
											</p>
										</div>
										<div className="flex flex-col gap-2 items-end">
											<Link
												href={`/jobs/${toSlug(job.title) + "-job-id-" + job.job_id.toLowerCase()}/apply`}
											>
												<Button className=" bg-blue-600 border border-blue-600 text-white hover:text-blue-600 hover:bg-transparent transition-all group">
													Apply Now
													<Send className="w-4 h-4 text-white group-hover:text-blue-600" />
												</Button>
											</Link>
											<div className="flex  text-sm whitespace-nowrap items-center justify-end gap-2 text-slate-700">
												<MapPin className="w-4 h-4" />
												<span>{job.location}</span>
											</div>
										</div>
									</div>

									{/* Tags and Info */}
									<div className="flex flex-wrap gap-2">
										<Badge
											className={
												"bg-pink-100 text-pink-800 hover:bg-pink-100 hover:cursor-default hover:text-pink-800"
											}
										>
											{job.department}
										</Badge>
										<Badge
											className={getEmploymentTypeColor(
												job.employment_type,
											)}
										>
											{job.employment_type}
										</Badge>
									</div>

									{/* Details */}
									<Badge
										variant={"secondary"}
										className="flex items-center gap-2 text-red-800 w-fit bg-red-100 hover:bg-red-100 hover:cursor-default hover:text-red-800"
									>
										<GraduationCap className="w-4 h-4" />
										<span>
											{job.experience_required}+ years
										</span>
									</Badge>
								</div>
							</Card>
						</Link>
					))}
				</div>
			) : (
				<Card className="p-12 text-center">
					<p className="text-muted-foreground">
						No jobs match your filters.
					</p>
				</Card>
			)}

			{totalPages > 1 && (
				<div className="flex items-center justify-between pt-4">
					<button
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
					>
						Previous
					</button>

					<div className="flex items-center gap-2">
						{Array.from(
							{ length: totalPages },
							(_, i) => i + 1,
						).map((page) => (
							<button
								key={page}
								onClick={() => onPageChange(page)}
								className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${
									currentPage === page
										? "bg-blue-600 text-primary-foreground"
										: "border border-input bg-background hover:bg-accent"
								}`}
							>
								{page}
							</button>
						))}
					</div>

					<button
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
};
