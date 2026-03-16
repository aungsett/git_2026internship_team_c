import { JobForm } from "@/features/admin/components/job-form";

export default function CreateNewJobPage() {
	return (
		<div className="min-h-screen bg-gray-50 px-4 max-w-4xl mx-auto flex flex-col gap-6">
			<div className="text-3xl font-bold text-gray-900">
				Create New Job
			</div>

			<JobForm />
		</div>
	);
}
