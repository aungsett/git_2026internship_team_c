import { STATUS_COLORS } from "@/features/hooks/useAdminStats";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";

export const StatusPieChart = ({ data }: { data: any[] }) => {
	return (
		<ResponsiveContainer height={350}>
			<PieChart>
				<Pie
					data={data}
					dataKey="value"
					nameKey="name"
					outerRadius={100}
					label
				>
					{data.map((entry, index) => (
						<Cell
							key={index}
							fill={STATUS_COLORS[entry.name] || "#ccc"}
						/>
					))}
				</Pie>

				<Tooltip
					formatter={(value: any, name: any, props: any) => [
						`${value} (${props.payload.percent}%)`,
						name,
					]}
				/>

				<Legend layout="vertical" className="border" />
			</PieChart>
		</ResponsiveContainer>
	);
};
