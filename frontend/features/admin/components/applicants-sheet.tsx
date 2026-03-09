import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Application } from "@/lib/types";
import { useRouter } from "next/navigation";

const getStatusStyle = (status: string) => {
	switch (status) {
		case "Shortlisted":
			return "bg-green-100 text-green-800";
		case "Pending":
			return "bg-yellow-100 text-yellow-800";
		case "Interviewed":
			return "bg-blue-100 text-blue-800";
		case "Rejected":
			return "bg-red-100 text-red-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export const ApplicantsSheet = ({
	filteredApplications,
	startIdx,
	endIdx,
}: {
	filteredApplications: Application[];
	startIdx: number;
	endIdx: number;
}) => {
	const paginatedApplications = filteredApplications.slice(startIdx, endIdx);
	const router = useRouter();
	return (
		<div className="overflow-x-auto rounded-lg bg-white shadow-sm">
			<table className="w-full">
				<thead className="border-b border-gray-200 bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
							Name
						</th>
						<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
							Contact Details
						</th>
						<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
							Qualification
						</th>
						<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
							Exp.
						</th>
						<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
							Status
						</th>
						<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
							Applied Date
						</th>
						<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{paginatedApplications.map((app, index) => (
						<tr
							key={index}
							className="border-b border-gray-200 hover:bg-gray-50"
						>
							<td className="px-6 py-4">
								<p className="font-semibold text-gray-900">
									{app.full_name}
								</p>
							</td>
							<td className="px-6 py-4">
								<p className="text-sm text-gray-600">
									{app.email}
								</p>
								<p className="text-sm text-gray-500">
									{app.phone_number ?? "—"}
								</p>
							</td>
							<td className="px-6 py-4">
								<p className="text-sm text-gray-900">
									{app.qualification ?? "—"}
								</p>
							</td>
							<td className="px-6 py-4">
								<p className="text-sm text-gray-600">
									{app.work_experience != null
										? `${app.work_experience} Year${app.work_experience !== 1 ? "s" : ""}`
										: "—"}
								</p>
							</td>
							<td className="px-6 py-4">
								<Badge
									className={`${getStatusStyle(app.status)} text-xs`}
								>
									{app.status}
								</Badge>
							</td>
							<td className="px-6 py-4">
								<p className="text-sm text-gray-600">
									{new Date(
										app.created_at,
									).toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</p>
							</td>
							<td className="px-6 py-4">
								<Button
									variant="link"
									className="text-blue-600"
									onClick={() => {
										router.push(
											`/dashboard/applicant-id=${app.id}`,
										);
									}}
								>
									View Details
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
