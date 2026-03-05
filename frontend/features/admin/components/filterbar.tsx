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
import { Application, SortOrder } from "@/lib/types";
import { Search } from "lucide-react";

interface FilterBarProps {
	search: string;
	setSearch: (value: string) => void;
	qualification: string;
	setQualification: (value: string) => void;
	experience: string;
	setExperience: (value: string) => void;
	course: string;
	setCourse: (value: string) => void;
	sort: SortOrder;
	setSort: (value: SortOrder) => void;
	handleReset: () => void;
	applications: Application[];
}

// Get unique values for dropdowns
const getUniqueQualifications = (apps: Application[]) => {
	return Array.from(new Set(apps.map((app) => app.qualification))).sort();
};

const getUniqueExperiences = (apps: Application[]) => {
	return Array.from(new Set(apps.map((app) => app.experience))).sort(
		(a, b) => {
			const numA = parseInt(a);
			const numB = parseInt(b);
			return numA - numB;
		},
	);
};

const getUniqueCourses = (apps: Application[]) => {
	return Array.from(new Set(apps.map((app) => app.course))).sort();
};

export const FilterBar = ({
	search,
	setSearch,
	qualification,
	setQualification,
	experience,
	setExperience,
	handleReset,
	course,
	setCourse,
	sort,
	setSort,
	applications,
}: FilterBarProps) => {
	return (
		<div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
			<div className="flex items-center gap-4 *:w-full">
				{/* Search */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Search Applicant
					</label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<Input
							type="text"
							placeholder="Name or email..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				{/* Qualification Filter */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Qualification
					</label>
					<Select
						value={qualification}
						onValueChange={setQualification}
					>
						<SelectTrigger>
							<SelectValue placeholder="Any Qualification" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="any">
								Any Qualification
							</SelectItem>
							{getUniqueQualifications(applications).map(
								(qual) => (
									<SelectItem key={qual} value={qual}>
										{qual}
									</SelectItem>
								),
							)}
						</SelectContent>
					</Select>
				</div>

				{/* Experience Filter */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Experience
					</label>
					<Select value={experience} onValueChange={setExperience}>
						<SelectTrigger>
							<SelectValue placeholder="Any Experience" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="any">Any Experience</SelectItem>
							{getUniqueExperiences(applications).map((exp) => (
								<SelectItem key={exp} value={exp}>
									{exp}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Course Filter */}
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Preferred Course
					</label>
					<Select value={course} onValueChange={setCourse}>
						<SelectTrigger>
							<SelectValue placeholder="Select Course" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="any">Any Course</SelectItem>
							{getUniqueCourses(applications).map((c) => (
								<SelectItem key={c} value={c}>
									{c}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Sorting */}
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

			{/* Action Buttons */}
			<div className="mt-6 flex justify-end gap-3">
				<Button variant="outline" onClick={handleReset}>
					Reset
				</Button>
				<Button className="bg-blue-600 hover:bg-blue-700">
					Apply Filters
				</Button>
			</div>
		</div>
	);
};
