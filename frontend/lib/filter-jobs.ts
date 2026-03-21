import { Job } from "@/features/hooks/useJobs";

export interface FilterOptions {
	searchQuery: string;
	departments: string[];
	employmentTypes: string[];
	salaryRange: [number, number];
	minExperience: number;
}

export const filterJobs = (jobs: Job[], filters: FilterOptions): Job[] => {
	console.log(jobs);
	return jobs.filter((job) => {
		if (filters.searchQuery) {
			const query = filters.searchQuery.toLowerCase();
			const matchesSearch =
				job.title.toLowerCase().includes(query) ||
				job.location.toLowerCase().includes(query);
			if (!matchesSearch) return false;
		}

		// Department filter
		if (filters.departments.length > 0) {
			if (!filters.departments.includes(job.department)) {
				return false;
			}
		}

		// Employment type filter
		if (filters.employmentTypes.length > 0) {
			if (!filters.employmentTypes.includes(job.employment_type)) {
				return false;
			}
		}

		// Experience filter
		if (filters.minExperience > 0 && (job.experience_required === null || job.experience_required < filters.minExperience)) {
		    return false;
		}

		return true;
	});
};
