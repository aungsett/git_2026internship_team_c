import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const KpiCards = ({
	total,
	selectionRate,
	rejectionRate,
	interviewRate,
}: any) => {
	const items = [
		{
			title: "Total Applicants",
			value: total,
			color: "text-slate-800",
		},
		{
			title: "Selection Rate",
			value: `${selectionRate}%`,
			color: "text-blue-600",
		},
		{
			title: "Interview Rate",
			value: `${interviewRate}%`,
			color: "text-blue-600",
		},
		{
			title: "Rejection Rate",
			value: `${rejectionRate}%`,
			color: "text-blue-600",
		},
	];

	return (
		<div>
			<div className="grid grid-cols-4 gap-4">
				{items.map((item, i) => (
					<Card key={i}>
						<CardHeader className="pb-1">
							<CardTitle className="text-">
								{item.title}
							</CardTitle>
						</CardHeader>
						<CardContent
							className={`text-4xl font-bold ${item.color}`}
						>
							{item.value}
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};
