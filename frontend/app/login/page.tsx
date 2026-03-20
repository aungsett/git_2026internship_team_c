"use client";

import { useState } from "react";
import {
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [resetSent, setResetSent] = useState(false);
	const [resetLoading, setResetLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			);
			const idToken = await userCredential.user.getIdToken();

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/admin/login`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token: idToken }),
				},
			);

			const data = await response.json();

			if (!response.ok || !data.success) {
				throw new Error(data.error || "Login failed");
			}

			localStorage.setItem(
				"admin",
				JSON.stringify({
					admin_id: data.admin_id,
					email: data.email,
					role: data.role,
					token: idToken,
				}),
			);

			router.push("/dashboard");
		} catch (err: any) {
			if (
				err.code === "auth/invalid-credential" ||
				err.code === "auth/wrong-password"
			) {
				setError("Invalid credentials. Please try again.");
			} else if (err.code === "auth/user-not-found") {
				setError("No account found with this email.");
			} else if (err.code === "auth/too-many-requests") {
				setError("Too many attempts. Please try again later.");
			} else {
				setError(err.message || "Something went wrong.");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleForgotPassword = async () => {
		if (!email) {
			setError("Please enter your email address above first.");
			return;
		}
		setResetLoading(true);
		setError("");
		try {
			await sendPasswordResetEmail(auth, email);
			setResetSent(true);
		} catch (err: any) {
			if (err.code === "auth/user-not-found") {
				setError("No account found with this email.");
			} else {
				setError("Failed to send reset email. Please try again.");
			}
		} finally {
			setResetLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
			{/* Logo */}
			<div className="flex flex-col items-center mb-6">
				<img
					src="/logo.png"
					alt="ATS Portal"
					width={36}
					height={36}
					className="mb-4"
				/>
				<span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
					ATS Portal
				</span>
			</div>

			{/* Card */}
			<div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-1">
					Admin Login
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					Access the applicant tracking dashboard
				</p>

				{resetSent ? (
					<div className="text-center py-4">
						<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
							<svg
								className="w-6 h-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<p className="font-semibold text-gray-800 mb-1">
							Reset email sent
						</p>
						<p className="text-sm text-gray-500 mb-4">
							Check your inbox at{" "}
							<span className="font-medium">{email}</span>
						</p>
						<button
							onClick={() => setResetSent(false)}
							className="text-blue-600 text-sm font-medium hover:underline"
						>
							Back to login
						</button>
					</div>
				) : (
					<form onSubmit={handleLogin} className="space-y-5">
						{/* Email */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email Address
							</label>
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="admin@ats-system.com"
								className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						{/* Password */}
						<div>
							<div className="flex items-center justify-between mb-1">
								<label className="text-sm font-medium text-gray-700">
									Password
								</label>
								<button
									type="button"
									onClick={handleForgotPassword}
									disabled={resetLoading}
									className="text-sm text-blue-600 hover:underline font-medium disabled:opacity-50"
								>
									{resetLoading
										? "Sending..."
										: "Forgot password?"}
								</button>
							</div>
							<input
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						{/* Error */}
						{error && (
							<div className="flex items-center gap-2 text-red-600 text-sm">
								<svg
									className="w-4 h-4 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								{error}
							</div>
						)}

						{/* Submit */}
						<button
							type="submit"
							disabled={loading}
							className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
						>
							{loading ? "Logging in..." : "Log In"}
						</button>
					</form>
				)}
			</div>

			{/* Footer */}
			<div className="mt-8 text-center">
				<p className="text-xs text-gray-400 mb-2">
					© 2026 Applicant Tracking System. All rights reserved.
				</p>
				<div className="flex items-center gap-4 justify-center">
					<button className="text-xs text-gray-400 hover:text-gray-600">
						Privacy Policy
					</button>
					<button className="text-xs text-gray-400 hover:text-gray-600">
						Terms of Service
					</button>
					<button className="text-xs text-gray-400 hover:text-gray-600">
						Support
					</button>
				</div>
			</div>
		</div>
	);
}
