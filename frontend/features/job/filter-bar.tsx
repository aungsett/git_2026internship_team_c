"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Job, SortOrder } from "@/lib/types";
import { Search } from "lucide-react";

interface FilterBarProps {
	search: string;
	setSearch: (value: string) => void;

	status: string;
	setStatus: (value: string) => void;

	experience: string;
	setExperience: (value: string) => void;

	department: string;
	setDepartment: (value: string) => void;

	employmentType: string;
	setEmploymentType: (value: string) => void;

	sort: SortOrder;
	setSort: (value: SortOrder) => void;

	handleReset: () => void;

	jobs: Job[];
}

// 🔹 Helpers
const getUniqueDepartments = (jobs: Job[]) => {
	return Array.from(
		new Set(jobs.map((job) => job.department).filter(Boolean)),
	).sort() as string[];
};

const getUniqueExperiences = (jobs: Job[]) => {
	return Array.from(
		new Set(
			jobs
				.map((job) => job.experience_required)
				.filter((e) => e != null)
				.map(String),
		),
	).sort((a, b) => parseInt(a) - parseInt(b));
};

const getUniqueEmploymentTypes = (jobs: Job[]) => {
	return Array.from(
		new Set(jobs.map((job) => job.employment_type).filter(Boolean)),
	).sort() as string[];
};

export const FilterBar = ({
	search,
	setSearch,
	status,
	setStatus,
	experience,
	setExperience,
	department,
	setDepartment,
	employmentType,
	setEmploymentType,
	sort,
	setSort,
	handleReset,
	jobs,
}: FilterBarProps) => {
	return (
		<div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
			<div className="flex items-center gap-4 *:w-full">
				{/* 🔍 Search */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Search Jobs
					</label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<Input
							type="text"
							placeholder="Title, location..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				{/* 🟢 Status */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Status
					</label>
					<Select value={status} onValueChange={setStatus}>
						<SelectTrigger>
							<SelectValue placeholder="Any Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="any">Any Status</SelectItem>
							<SelectItem value="Published">Published</SelectItem>
							<SelectItem value="Draft">Draft</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* 💼 Employment Type */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Employment Type
					</label>
					<Select
						value={employmentType}
						onValueChange={setEmploymentType}
					>
						<SelectTrigger>
							<SelectValue placeholder="Any Type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="any">Any Type</SelectItem>
							{getUniqueEmploymentTypes(jobs).map((type) => (
								<SelectItem key={type} value={type}>
									{type}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 🧠 Experience */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Experience Required
					</label>
					<Select value={experience} onValueChange={setExperience}>
						<SelectTrigger>
							<SelectValue placeholder="Any Experience" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="any">Any Experience</SelectItem>
							{getUniqueExperiences(jobs).map((exp) => (
								<SelectItem key={exp} value={exp}>
									{exp} Year{exp !== "1" ? "s" : ""}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 🏢 Department */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Department
					</label>
					<Select value={department} onValueChange={setDepartment}>
						<SelectTrigger>
							<SelectValue placeholder="Any Department" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="any">Any Department</SelectItem>
							{getUniqueDepartments(jobs).map((dept) => (
								<SelectItem key={dept} value={dept}>
									{dept}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 📅 Sorting */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Sort By Date
					</label>
					<Select
						value={sort}
						onValueChange={(value) => setSort(value as SortOrder)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">Newest First</SelectItem>
							<SelectItem value="oldest">Oldest First</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* 🔘 Actions */}
			<div className="mt-6 flex justify-end gap-3">
				<Button
					variant="outline"
					onClick={handleReset}
					className="hover:bg-red-600 hover:text-white transition-all"
				>
					Reset
				</Button>
			</div>
		</div>
	);
};
