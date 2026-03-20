import Link from "next/link";
import { auth } from "@/lib/firebase";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getCsrfToken } from "@/lib/security";
import { useEffect, useState } from "react";

export const Header = () => {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

	useEffect(() => {
		const checkSession = async () => {
			if (!backendUrl) {
				setIsAuthenticated(false);
				return;
			}

			try {
				const response = await fetch(`${backendUrl}/auth/session`, {
					method: "GET",
					credentials: "include",
				});
				setIsAuthenticated(response.ok);
			} catch {
				setIsAuthenticated(false);
			}
		};

		checkSession();
	}, [backendUrl]);

	const handleLogout = async () => {
		const csrfToken = getCsrfToken();
		const headers: HeadersInit = {};

		if (csrfToken) {
			headers["X-CSRF-Token"] = csrfToken;
		}

		try {
			if (backendUrl) {
				await fetch(`${backendUrl}/auth/logout`, {
					method: "POST",
					credentials: "include",
					headers,
				});
			}
		} catch {
			// Redirect should still happen even if backend is temporarily unavailable.
		} finally {
			try {
				await signOut(auth);
			} catch {
				// Ignore Firebase sign-out issues and continue navigation.
			}
			setIsAuthenticated(false);
			router.push("/");
		}
	};

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
					{user == null ? (
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
						</>
					)}
				</div>
			</div>
			<div className="flex gap-4">
				{!isAuthenticated ? (
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
