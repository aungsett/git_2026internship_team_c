import Link from "next/link";
import { auth } from "@/lib/firebase";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const Header = () => {
	const router = useRouter();
	const user = auth.currentUser;
	return (
		<header className="fixed top-0 left-0 w-full bg-white border-b border-slate-200 flex items-center justify-between px-4 py-2 z-[1000]">
			<h1 className="text-xl font-bold text-slate-900 flex items-center">
				<img
					src="/logo.png"
					alt="ATS Portal Logo"
					className="h-6 w-auto inline-block mr-2"
				/>
				ATS Portal
			</h1>
			<div className="flex gap-4">
				{user == null ? (
					<>
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
					</>
				) : (
					<>
						<Button
							onClick={() => router.push("/dashboard/create-job")}
							className="bg-blue-600 text-white hover:text-white hover:bg-blue-700"
						>
							Create Job
						</Button>
						<Button
							onClick={() => router.push("/dashboard")}
							className="bg-blue-600 text-white hover:text-white hover:bg-blue-700"
						>
							Dashboard
						</Button>
						<Button
							// onClick={() => router.push("/logout")}
							variant="outline"
							className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-all"
						>
							Log Out
						</Button>
					</>
				)}
			</div>
		</header>
	);
};
