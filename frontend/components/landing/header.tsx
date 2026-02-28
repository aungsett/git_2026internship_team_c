import Link from "next/link";

export const Header = () => {
	return (
		<header className="fixed top-0 left-0 w-full bg-white border-b border-slate-200 flex items-center justify-between mb-4 px-4 py-2">
			<h1 className="text-xl font-bold text-slate-900 flex items-center">
				<img
					src="/logo.png"
					alt="ATS Portal Logo"
					className="h-6 w-auto inline-block mr-2"
				/>
				ATS Portal
			</h1>
			<div className="flex gap-4">
				<button className="font-semibold px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
					Jobs
				</button>
				<button className="font-semibold px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
					Company
				</button>
				<button className="font-semibold px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
					Help
				</button>
				<Link
					href="/login"
					className="font-semibold px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-800 transition-all"
				>
					Log In
				</Link>
			</div>
		</header>
	);
};
