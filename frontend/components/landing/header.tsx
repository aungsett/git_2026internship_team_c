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
			<h1 className="text-xl font-bold text-slate-900 flex items-center">
				<img
					src="/logo.png"
					alt="ATS Portal Logo"
					className="h-6 w-auto inline-block mr-2"
				/>
				ATS Portal
			</h1>
			<div className="flex gap-4">
				{!isAuthenticated ? (
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
