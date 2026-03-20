"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useJobDetails } from "@/features/hooks/useJobDetails";

import { Send } from "lucide-react";
import Link from "next/link";

export default function Page() {
	const { jobDetails, loading, error, details, expired, pathname } =
		useJobDetails();
	if (loading) {
		return (
			<main className="min-h-screen px-10 py-10">
				<p className="text-slate-500">Loading job details...</p>
			</main>
		);
	}

	if (error) {
		return (
			<main className="min-h-screen px-10 py-10">
				<p className="text-red-500">{error}</p>
			</main>
		);
	}
	return (
		<main className="min-h-screen px-10 py-8">
			{/* Title Section */}
			<div className="mb-8 flex justify-between">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h1 className="text-4xl font-bold text-slate-900 mb-2">
							{jobDetails?.title}
						</h1>
						<p className="text-sm text-slate-600">
							Job ID: {jobDetails?.job_id}
						</p>
					</div>
					{!expired ? (
						<Badge
							variant="outline"
							className="bg-emerald-100 text-emerald-800 border-emerald-200"
						>
							OPEN
						</Badge>
					) : (
						<Badge
							variant="outline"
							className="bg-red-100 text-red-800 border-red-200"
						>
							CLOSED
						</Badge>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3">
					<Link href={!expired ? `${pathname}/apply` : ""}>
						<Button
							disabled={expired}
							className="gap-2 bg-blue-600 hover:bg-blue-700"
						>
							Apply Now
							<Send className="w-4 h-4 text-white" />
						</Button>
					</Link>
				</div>
			</div>

			<div className="flex gap-10">
				{/* Main Content */}
				<Card className="p-6 bg-white flex flex-col gap-6 h-fit max-w-5xl w-full">
					{/* Job Description */}
					<div className="flex flex-col gap-4">
						<h2 className="text-xl font-semibold text-slate-900">
							Job Description
						</h2>
						<p className="text-slate-600 leading-relaxed">
							{jobDetails?.description}
						</p>
					</div>
				</Card>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Job Information */}
					<Card className="p-6 bg-white top-8">
						<h3 className="text-lg font-semibold text-slate-900 mb-6">
							Job Information
						</h3>
						<div className="space-y-5">
							{details.map((item, index) => {
								const Icon = item.icon;
								return (
									<div
										key={index}
										className="flex items-center gap-3"
									>
										<Icon className="w-5 h-5 text-blue-600" />

										<div className="">
											<p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
												{item.label}
											</p>
											<p
												className={`text-sm ${item.label === "DEADLINE" ? "text-red-500" : "text-slate-700"} font-medium`}
											>
												{item.value}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					</Card>

					{/* Skills & Competencies */}
					<Card className="p-6 bg-white">
						<h3 className="text-lg font-semibold text-slate-900 mb-4">
							Skills & Competencies
						</h3>
						<div className="flex flex-wrap gap-2">
							{jobDetails?.skills.map((skill) => (
								<Badge
									key={skill}
									variant="secondary"
									className="bg-blue-50 text-blue-700 border-blue-200"
								>
									{skill}
								</Badge>
							))}
						</div>
					</Card>
				</div>
			</div>
		</main>
	);
}
