"use client";

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from "recharts";

export const ApplicationsLineChart = ({ data }: { data: any[] }) => {
	return (
		<div className="w-full flex items-center justify-center">
			<LineChart width={1000} height={300} data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="date" />
				<YAxis />
				<Tooltip />
				<Line type="bump" dataKey="count" color="#1d4ed8" />
			</LineChart>
		</div>
	);
};
