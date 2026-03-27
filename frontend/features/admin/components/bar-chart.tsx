"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const DropOffBarChart = ({ data }: { data: any[] }) => {
	return (
		<div className="w-full h-[300px] flex items-center justify-center">
			<BarChart width={700} height={300} data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="stage" />
				<YAxis />
				<Tooltip />
				<defs>
					<linearGradient
						id="dropOffColor"
						x1="0"
						y1="0"
						x2="0"
						y2="1"
					>
						<stop
							offset="5%"
							stopColor="#1d4ed8"
							stopOpacity={0.8}
						/>
						<stop
							offset="95%"
							stopColor="#1d4ed8"
							stopOpacity={0.2}
						/>
					</linearGradient>
				</defs>
				<Bar dataKey="loss" fill="url(#dropOffColor)" />
			</BarChart>
		</div>
	);
};
