"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	ArrowLeft,
	MapPin,
	Briefcase,
	Calendar,
	DollarSign,
	Clock,
	SendHorizonal,
	Send,
	Building2,
} from "lucide-react";

export default function Page() {
	const details = [
		{
			icon: MapPin,
			label: "LOCATION",
			value: "San Francisco, CA (Hybrid)",
		},
		{
			icon: Briefcase,
			label: "EMPLOYMENT TYPE",
			value: "Full-time",
		},
		{
			icon: Building2,
			label: "DEPARTMENT",
			value: "Engineering",
		},
		{
			icon: DollarSign,
			label: "SALARY RANGE",
			value: "$140,000-$180,000 / yr",
		},
		{
			icon: Clock,
			label: "EXPERIENCE REQUIRED",
			value: "3-5 Years",
		},
		{
			icon: Calendar,
			label: "DEADLINE",
			value: "October 31, 2027",
		},
	];
	const expired = new Date(details[5].value).getTime() < Date.now();
	return (
		<main className="min-h-screen px-10 py-0">
			{/* Title Section */}
			<div className="mb-8 flex justify-between">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h1 className="text-4xl font-bold text-slate-900 mb-2">
							Software Engineer
						</h1>
						<p className="text-sm text-slate-600">
							Job ID: JOB-2024-001
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
					{/* <Button variant="outline" className="gap-2">
						Edit Job
					</Button> */}
					<Button
						disabled={expired}
						className="gap-2 bg-blue-600 hover:bg-blue-700"
					>
						Apply Now
						<Send className="w-4 h-4 text-white" />
					</Button>
				</div>
			</div>

			<div className="flex gap-10">
				{/* Main Content */}
				<Card className="p-6 bg-white flex flex-col gap-6 h-fit max-w-5xl">
					{/* Job Description */}
					<div className="flex flex-col gap-4">
						<h2 className="text-xl font-semibold text-slate-900">
							Job Description
						</h2>
						<p className="text-slate-600 leading-relaxed">
							We are seeking a talented Software Engineer to join
							our core infrastructure team. In this role, you will
							be responsible for designing, developing, and
							maintaining scalable web applications and
							distributed systems. The ideal candidate is a
							self-starter with a passion for clean code, system
							architecture, and solving complex technical
							challenges. You will work closely with product
							managers and designers to build features that impact
							thousands of users globally.
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
							{[
								"React",
								"Node.js",
								"TypeScript",
								"PostgreSQL",
								"AWS Lambda",
								"Docker",
								"System Design",
								"CI/CD",
							].map((skill) => (
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
