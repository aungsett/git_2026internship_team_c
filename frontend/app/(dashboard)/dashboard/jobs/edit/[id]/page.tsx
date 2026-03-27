import { EditForm } from "@/features/job/edit-form";

export default function Page({ params }: { params: { id: string } }) {
	return (
		<div className="min-h-screen bg-gray-50 px-4 max-w-4xl mx-auto flex flex-col gap-6">
			<div className="text-3xl font-bold text-gray-900">Edit Job</div>
			<EditForm slug={params.id} />
		</div>
	);
}
