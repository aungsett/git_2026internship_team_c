import ApplicationsPage from "@/features/admin/components/applicants";
import { Overview } from "@/features/admin/components/overview";

export default function Page() {
	return (
		<main className="px-10 py-4 flex flex-col gap-4 pt-[70px]">
			<ApplicationsPage />
			{/* <Overview /> */}
		</main>
	);
}
