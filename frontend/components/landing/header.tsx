"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "../hooks/useAuth";

export const Header = () => {
	const { isAuthenticated, authStatus, handleLogout } = useAuth();

	return (
		<header className="fixed top-0 left-0 w-full bg-white border-b border-slate-200 flex items-center justify-between px-4 py-2 z-[1000]">
			<div className="flex items-center gap-10">
				<h1 className="text-xl font-semibold text-slate-800 flex items-center tracking-tight">
					<img
						src="/logo.png"
						alt="ATS Portal Logo"
						className="h-6 w-auto inline-block mr-2"
					/>
					ATS Portal
				</h1>
				<div className="flex gap-10">
					{!isAuthenticated ? (
						<>
							<Link href="/jobs">
								<button className="underline-offset-[6px] decoration-blue-700 hover:underline hover:text-blue-800 transition-all">
									Jobs
								</button>
							</Link>
							<Link href="/login">
								<button className="underline-offset-[6px] decoration-blue-700 hover:underline hover:text-blue-800 transition-all">
									Company
								</button>
							</Link>
							<Link href="/">
								<button className="underline-offset-[6px] decoration-blue-700 hover:underline hover:text-blue-800 transition-all">
									Help
								</button>
							</Link>
						</>
					) : (
						<>
							<Link href="/dashboard">
								<button className="underline-offset-[6px] decoration-blue-700 hover:underline hover:text-blue-800 transition-all">
									Dashboard
								</button>
							</Link>
							<Link href="/dashboard/jobs">
								<button className="underline-offset-[6px] decoration-blue-700 hover:underline hover:text-blue-800 transition-all">
									Jobs
								</button>
							</Link>
							<Link href="/dashboard/analytics">
								<button className="underline-offset-[6px] decoration-blue-700 hover:underline hover:text-blue-800 transition-all">
									Analytics
								</button>
							</Link>
						</>
					)}
				</div>
			</div>
			<div className="flex gap-4">
				{authStatus === "unknown" ? null : !isAuthenticated ? (
					<>
						<Link href="/login">
							<Button className="bg-blue-600 text-white hover:text-white hover:bg-blue-700">
								Log In
							</Button>
						</Link>
					</>
				) : (
					<>
						<Link href="/dashboard/create-job">
							<Button className="bg-blue-600 text-white hover:text-white hover:bg-blue-700">
								Create Job
							</Button>
						</Link>

						<Button
							onClick={handleLogout}
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
