import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Application } from "@/lib/types";
// Status badge styling
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
					{paginatedApplications.map((app) => (
						<tr
							key={app.id}
							className="border-b border-gray-200 hover:bg-gray-50"
						>
							<td className="px-6 py-4">
								<p className="font-semibold text-gray-900">
									{app.name}
								</p>
							</td>
							<td className="px-6 py-4">
								<p className="text-sm text-gray-600">
									{app.email}
								</p>
								<p className="text-sm text-gray-500">
									{app.phone}
								</p>
							</td>
							<td className="px-6 py-4">
								<p className="text-sm text-gray-900">
									{app.qualification}
								</p>
							</td>
							<td className="px-6 py-4">
								<p className="text-sm text-gray-600">
									{app.experience}
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
									{app.appliedDate.toLocaleDateString(
										"en-US",
										{
											year: "numeric",
											month: "short",
											day: "numeric",
										},
									)}
								</p>
							</td>
							<td className="px-6 py-4">
								<Button
									variant="link"
									className="text-blue-600"
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
