import { ApplicationReview } from "@/features/admin/components/applicant-review";
import { Router } from "next/router";

export default function Page({
	params,
}: {
	params: {
		slug: string[];
	};
}) {
	const path = params.slug[0];
	const id = path.split("%3D")[1];
	return (
		<main className="px-10 py-4 ">
			<ApplicationReview appId={id} />
		</main>
	);
}
