import Link from "next/link";

export default function Home() {
	return (
		<main className="min-h-screen px-10 py-10">
			<div className="bg-white rounded-lg shadow p-6 w-fit">
				<h1 className="text-2xl font-bold text-slate-900 mb-4">
					Senior Software Engineer
				</h1>
				<Link
					href="/jobs/senior-software-engineer"
					className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
				>
					Apply Now
				</Link>
			</div>
		</main>
	);
}
