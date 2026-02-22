import Link from "next/link";

export const Footer = () => {
	return (
		<footer className="bg-white border-t border-slate-200 mt-8 p-10 flex justify-between items-center">
			<div className="flex items-center text-slate-700 font-medium">
				<img
					src="/logo.png"
					alt="ATS Portal Logo"
					className="h-4 w-auto inline-block mr-2 grayscale"
				/>
				ATS Portal © {new Date().getFullYear()}
			</div>
			<div className="flex gap-6">
				<Link
					href="/"
					className="text-sm text-slate-600 hover:text-slate-900"
				>
					Privacy
				</Link>
				<Link
					href="/"
					className="text-sm text-slate-600 hover:text-slate-900"
				>
					Terms
				</Link>
				<Link
					href="/"
					className="text-sm text-slate-600 hover:text-slate-900"
				>
					Support
				</Link>
			</div>
		</footer>
	);
};
