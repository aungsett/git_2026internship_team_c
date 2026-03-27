"use client";

import { Loader } from "@/components/landing/loader";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DropOffBarChart } from "@/features/admin/components/bar-chart";
import { ConversionBarChart } from "@/features/admin/components/conv-bar-chart";
import { KpiCards } from "@/features/admin/components/kpi-cards";
import { ApplicationsLineChart } from "@/features/admin/components/line-chart";
import { StatusPieChart } from "@/features/admin/components/status-pie-chart";
import { useAdminStats } from "@/features/hooks/useAdminStats";

export default function Page() {
	const stats = useAdminStats();

	return (
		<main className="min-h-screen px-10 py-4 flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">
					Pipeline Metrics
				</h1>
				<p className="mt-2 text-gray-600">
					Intelligent Recuitment Insights
				</p>
			</div>
			{stats.loading ? (
				<div className=" flex pt-36">
					<Loader />
				</div>
			) : (
				<>
					<KpiCards
						total={stats.totalApplicants}
						selectionRate={stats.selectionRate}
						rejectionRate={stats.rejectionRate}
						interviewRate={stats.interviewRate}
					/>

					<div className="flex gap-6 relative">
						<Card className="w-full">
							<CardHeader>
								<CardTitle className="text-lg">
									Applications Over Time
								</CardTitle>
								<CardDescription>
									Candidate inflow comparison
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ApplicationsLineChart
									data={stats.applicationsLineData}
								/>
							</CardContent>
						</Card>
						<Card className="w-[400px]">
							<CardHeader>
								<CardTitle className="text-lg">
									Status Distribution
								</CardTitle>
							</CardHeader>
							<CardContent>
								<StatusPieChart data={stats.statusPieData} />
							</CardContent>
						</Card>
					</div>

					<div className="flex gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">
									Conversion Funnel
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ConversionBarChart
									data={stats.conversionFunnel}
								/>
							</CardContent>
						</Card>

						<Card className="w-full">
							<CardHeader>
								<CardTitle className="text-lg">
									Drop-off Analysis
								</CardTitle>
							</CardHeader>
							<CardContent>
								<DropOffBarChart data={stats.dropOffFunnel} />
							</CardContent>
						</Card>
					</div>
				</>
			)}
		</main>
	);
}
