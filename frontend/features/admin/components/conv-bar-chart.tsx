"use client";

import { STATUS_COLORS } from "@/features/hooks/useAdminStats";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	Cell,
} from "recharts";

export const ConversionBarChart = ({ data }: { data: any[] }) => {
	return (
		<div className="w-full h-[300px]">
			<BarChart width={600} height={300} data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="stage" />
				<YAxis />
				<Tooltip />
				<Bar dataKey="value">
					{data.map((entry, index) => {
						let color = "#8884d8";

						if (entry.stage === "Pending")
							color = STATUS_COLORS.Pending;
						if (entry.stage === "Interviewed")
							color = STATUS_COLORS.Interviewed;
						if (entry.stage === "Shortlisted")
							color = STATUS_COLORS.Shortlisted;
						if (entry.stage === "Applied") color = "#bbb"; // purple-400 (neutral start)

						return <Cell key={index} fill={color} />;
					})}
				</Bar>
			</BarChart>
		</div>
	);
};
