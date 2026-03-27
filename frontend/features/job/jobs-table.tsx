"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/types";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toSlug } from "./job-results";
import { api } from "@/lib/api";

const getStatusStyle = (status: string) => {
	switch (status) {
		case "Published":
			return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800 hover:cursor-default";
		case "Draft":
			return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800 hover:cursor-default";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export const JobsTable = ({
	filteredJobs,
	startIdx,
	endIdx,
}: {
	filteredJobs: Job[];
	startIdx: number;
	endIdx: number;
}) => {
	const paginatedJobs = filteredJobs.slice(startIdx, endIdx);
	const router = useRouter();
	return (
		<div className="overflow-x-auto rounded-lg bg-white shadow-sm">
			<table className="w-full">
				<thead className="border-b border-gray-200 bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">
							Job
						</th>
						<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">
							Department
						</th>
						<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">
							Experience
						</th>
						<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">
							Type
						</th>
						<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">
							Status
						</th>
						<th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">
							Created
						</th>
						<th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-600">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{paginatedJobs.map((job, index) => (
						<tr
							key={job.id}
							className="border-b border-gray-200 hover:bg-gray-50/50"
						>
							{/* Job Title + Location */}
							<td className="px-6 py-4">
								<p className="font-semibold text-gray-900 text-lg">
									{job.title}
								</p>

								<div className="flex items-center gap-1 text-sm text-gray-500">
									<MapPin size={14} />
									<span>{job.location}</span>
								</div>

								<p className="text-xs text-gray-500 mt-1">
									{job.job_id}
								</p>
							</td>

							{/* Department */}
							<td className="px-6 py-4 text-sm text-gray-600">
								{job.department ?? "—"}
							</td>

							{/* Experience */}
							<td className="px-6 py-4 text-sm text-gray-600">
								{job.experience_required != null
									? `${job.experience_required} Year${job.experience_required !== 1 ? "s" : ""}`
									: "—"}
							</td>

							{/* Type */}
							<td className="px-6 py-4 text-sm text-gray-600">
								{job.employment_type}
							</td>

							{/* Status */}
							<td className="px-6 py-4">
								<Badge
									className={`${getStatusStyle(job.status)} text-xs`}
								>
									{job.status}
								</Badge>
							</td>

							{/* Created */}
							<td className="px-6 py-4 text-sm text-gray-600">
								{new Date(job.created_at).toLocaleDateString(
									"en-US",
									{
										year: "numeric",
										month: "short",
										day: "numeric",
									},
								)}
							</td>

							{/* Actions */}
							<td className="px-2 py-4">
								<div className="flex items-center justify-center gap-3">
									{/* View */}
									{/* <Button
										variant="link"
										className="text-blue-600 p-0"
										onClick={() =>
											router.push(
												`/dashboard/jobs/${toSlug(job.title) + "-job-id-" + job.job_id.toLowerCase()}`,
											)
										}
									>
										View
									</Button> */}

									{/* Edit */}
									<Button
										variant="ghost"
										size="icon"
										onClick={() =>
											router.push(
												`/dashboard/jobs/edit/${toSlug(job.title) + "-job-id-" + job.job_id.toLowerCase()}`,
											)
										}
									>
										<Pencil size={16} />
									</Button>

									{/* Delete */}
									<Button
										variant="ghost"
										size="icon"
										className="text-red-500 hover:text-red-600"
										onClick={async () => {
										    if (!confirm("Are you sure you want to delete this job?")) return;
										    try {
										        await api.deleteJob(job.id);
										        window.location.reload();
										    } catch (err: any) {
										        alert(err.message || "Failed to delete job");
										    }
										}}
									>
										<Trash2 size={16} />
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
