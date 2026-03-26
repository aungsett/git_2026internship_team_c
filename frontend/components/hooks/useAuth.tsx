import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getCsrfToken } from "@/lib/security";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

export const useAuth = () => {
	const router = useRouter();
	const pathname = usePathname();
	const assumeAuthenticated = pathname.startsWith("/dashboard");
	const [authStatus, setAuthStatus] = useState<AuthStatus>(
		assumeAuthenticated ? "authenticated" : "unknown",
	);
	const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

	useEffect(() => {
		let isCancelled = false;

		const checkSession = async () => {
			if (!backendUrl) {
				if (!isCancelled) {
					setAuthStatus(
						assumeAuthenticated
							? "authenticated"
							: "unauthenticated",
					);
				}
				return;
			}

			try {
				const response = await fetch(`${backendUrl}/auth/session`, {
					method: "GET",
					credentials: "include",
				});
				if (!isCancelled) {
					setAuthStatus(
						response.ok ? "authenticated" : "unauthenticated",
					);
				}
			} catch {
				if (!isCancelled) {
					setAuthStatus(
						assumeAuthenticated
							? "authenticated"
							: "unauthenticated",
					);
				}
			}
		};

		checkSession();
		return () => {
			isCancelled = true;
		};
	}, [backendUrl, assumeAuthenticated]);

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
			setAuthStatus("unauthenticated");
			router.push("/");
		}
	};

	const isAuthenticated = authStatus === "authenticated";
	return { isAuthenticated, authStatus, handleLogout };
};
