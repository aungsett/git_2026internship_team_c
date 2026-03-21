"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FilterOptions } from "@/lib/filter-jobs";

interface JobFiltersProps {
    filters: FilterOptions;
    onFiltersChange: (filters: FilterOptions) => void;
    departments: string[];
}

const EMPLOYMENT_TYPES = ["Full-time", "Part-time"];

export const JobFilters = ({ filters, onFiltersChange, departments }: JobFiltersProps) => {
	const handleDepartmentChange = (department: string, checked: boolean) => {
		const newDepartments = checked
			? [...filters.departments, department]
			: filters.departments.filter((d) => d !== department);
		onFiltersChange({ ...filters, departments: newDepartments });
	};

	const handleEmploymentTypeChange = (type: string, checked: boolean) => {
		const newTypes = checked
			? [...filters.employmentTypes, type]
			: filters.employmentTypes.filter((t) => t !== type);
		onFiltersChange({ ...filters, employmentTypes: newTypes });
	};

	const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value) || 0;
		onFiltersChange({ ...filters, minExperience: Math.max(0, value) });
	};

	return (
		<Card className="h-fit p-6 flex flex-col gap-4">
			<p className="text-lg font-semibold pb-2 border-b-2">Filters</p>

			<div>
				<h3 className="font-medium mb-3 text-sm">Department</h3>
				<div className="space-y-2">
					{departments.map((dept) => (
						<div key={dept} className="flex items-center space-x-2">
							<Checkbox
								id={`dept-${dept}`}
								checked={filters.departments.includes(dept)}
								onCheckedChange={(checked) =>
									handleDepartmentChange(
										dept,
										checked as boolean,
									)
								}
							/>
							<label
								htmlFor={`dept-${dept}`}
								className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								{dept}
							</label>
						</div>
					))}
				</div>
			</div>

			<div>
				<h3 className="font-medium mb-3 text-sm">Employment Type</h3>
				<div className="space-y-2">
					{EMPLOYMENT_TYPES.map((type) => (
						<div key={type} className="flex items-center space-x-2">
							<Checkbox
								id={`type-${type}`}
								checked={filters.employmentTypes.includes(type)}
								onCheckedChange={(checked) =>
									handleEmploymentTypeChange(
										type,
										checked as boolean,
									)
								}
							/>
							<label
								htmlFor={`type-${type}`}
								className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								{type}
							</label>
						</div>
					))}
				</div>
			</div>

			<div>
				<h3 className="font-medium mb-3 text-sm">
					Minimum Experience (years)
				</h3>
				<Input
					type="number"
					min="0"
					value={filters.minExperience}
					onChange={handleExperienceChange}
					placeholder="0"
					className="w-full"
				/>
			</div>
		</Card>
	);
};
