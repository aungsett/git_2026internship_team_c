"use client";
import { useState } from "react";
import { CVUploadSection } from "@/features/applicant/components/cv-upload-section";
import { ApplicantForm } from "@/features/applicant/components/applicant-form";
import { Loader } from "@/features/applicant/components/loader";
import { api } from "@/lib/api";
import { usePathname } from "next/navigation";

export default function Page() {
	const pathname = usePathname();
	const extract = (pathname: string) => {
		const segments = pathname.split("/");
		const slug = segments[2];
		if (!slug) return null;
		const titlePart =
			slug
				.split("-job-id-")[0]
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ") + "";
		const jobId = slug.split("-job-id-")[1];
		return { titlePart, jobId };
	};
	const [parseAI, setParseAI] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		phone: "",
		email: "",
		currentAddress: "",
		highestQualification: "",
		college: "",
		yearsOfExperience: "",
		preferredJapaneseCourse: "",
		coreSkills: "",
		languagesKnown: "",
		linkedIn: "",
		portfolioGithub: "",
		additionalNotes: "",
		professionalSummary: "",
		acceptTerms: false,
	});
	const [cvFile, setCvFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");

	const handleTextExtracted = async (text: string) => {
		if (!text.trim()) return;

		setParseAI(true);
		try {
			const result = await api.parseCV(text);
			const parsed = result?.data as
				| {
						first_name?: string | null;
						last_name?: string | null;
						email?: string | null;
						phone_number?: string | null;
						address?: string | null;
						date_of_birth?: string | null;
						qualification?: string | null;
						college?: string | null;
						work_experience?: number | null;
						skills?: string[] | null;
						language?: string[] | null;
						professional_summary?: string | null;
				  }
				| undefined;

			if (!parsed) return;

			setFormData((prev) => ({
				...prev,
				firstName: parsed.first_name ?? prev.firstName,
				lastName: parsed.last_name ?? prev.lastName,
				email: parsed.email ?? prev.email,
				phone: parsed.phone_number ?? prev.phone,
				currentAddress: parsed.address ?? prev.currentAddress,
				dateOfBirth: parsed.date_of_birth ?? prev.dateOfBirth,
				highestQualification:
					parsed.qualification ?? prev.highestQualification,
				college: parsed.college ?? prev.college,
				yearsOfExperience:
					parsed.work_experience != null
						? String(parsed.work_experience)
						: prev.yearsOfExperience,
				coreSkills:
					Array.isArray(parsed.skills) && parsed.skills.length > 0
						? parsed.skills.join(", ")
						: prev.coreSkills,
				languagesKnown:
					Array.isArray(parsed.language) && parsed.language.length > 0
						? parsed.language.join(", ")
						: prev.languagesKnown,
				professionalSummary:
					parsed.professional_summary
						?? prev.professionalSummary,
				additionalNotes:
					prev.additionalNotes,
			}));
		} catch (err: any) {
			setError(
				err?.message ||
					"Failed to parse your CV. You can still fill the form manually.",
			);
		} finally {
			setParseAI(false);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value, type } = e.target;
		const checked =
			type === "checkbox"
				? (e.target as HTMLInputElement).checked
				: undefined;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!cvFile) {
			setError("Please upload your CV before submitting.");
			return;
		}

		const experience = formData.yearsOfExperience.trim();
		if (!/^\d+$/.test(experience)) {
			setError(
				"Years of experience must be a whole number (example: 0, 1, 2).",
			);
			return;
		}

		setLoading(true);

		try {
			const payload = new FormData();

			// Basic fields
			payload.append("first_name", formData.firstName);
			payload.append("last_name", formData.lastName);
			payload.append("email", formData.email);
			payload.append("phone_number", formData.phone);
			payload.append("address", formData.currentAddress);
			payload.append("date_of_birth", formData.dateOfBirth);
			payload.append("qualification", formData.highestQualification);
			payload.append("college", formData.college);
			payload.append("work_experience", experience);
			payload.append(
				"preferred_japanese_course",
				formData.preferredJapaneseCourse,
			);
			payload.append("comments", formData.additionalNotes);
			payload.append("professional_summary", formData.professionalSummary); 
			payload.append(
				"job_id",
				extract(pathname)?.jobId.toUpperCase() + "",
			);

			// Arrays — split comma separated strings
			formData.coreSkills
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean)
				.forEach((skill) => payload.append("skills", skill));

			formData.languagesKnown
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean)
				.forEach((lang) => payload.append("language", lang));

			// Social links
			if (formData.linkedIn)
				payload.append("social_links", formData.linkedIn);
			if (formData.portfolioGithub)
				payload.append("social_links", formData.portfolioGithub);

			// CV file
			payload.append("file", cvFile);

			await api.submitApplication(payload);
			setSuccess(true);
		} catch (err: any) {
			setError(err.message || "Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
				<div className="bg-white rounded-lg shadow p-10 text-center max-w-md">
					<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-8 h-8 text-green-600"
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
					<h2 className="text-2xl font-bold text-slate-900 mb-2">
						Application Submitted!
					</h2>
					<p className="text-slate-600">
						Thank you for applying. We will review your application
						and get back to you shortly.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen bg-slate-50 py-8">
			{parseAI && <Loader setParseAI={setParseAI} />}
			<div className="flex-1 w-full px-4">
				<div className="max-w-4xl mx-auto">
					<div className="mb-8">
						<h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
							Apply for {extract(pathname)?.titlePart}
						</h1>
						<p className="text-slate-600">
							Please fill out the form below to submit your
							application. This should take about 5-10 minutes.
						</p>
					</div>
					<form onSubmit={handleSubmit} className="space-y-6">
						<CVUploadSection
							onFileSelect={setCvFile}
							onTextExtracted={handleTextExtracted}
						/>
						<ApplicantForm
							formData={formData}
							handleInputChange={handleInputChange}
						/>
						<div className="flex items-start gap-3">
							<input
								type="checkbox"
								name="acceptTerms"
								id="acceptTerms"
								checked={formData.acceptTerms}
								onChange={handleInputChange}
								className="mt-1 w-4 h-4 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
							/>
							<label
								htmlFor="acceptTerms"
								className="text-sm text-slate-700"
							>
								I agree to the Terms of Service and Privacy
								Policy regarding the storage and processing of
								my application data.
							</label>
						</div>

						{error && (
							<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-700">{error}</p>
							</div>
						)}

						<div className="flex flex-col items-center gap-3">
							<div className="flex flex-col items-center gap-4 w-full">
								<button
									type="submit"
									disabled={!formData.acceptTerms || loading}
									className="w-1/2 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
								>
									{loading
										? "Submitting..."
										: "Submit Application"}
								</button>
							</div>
							<p className="text-xs text-slate-600 mt-2">
								Once submitted, you will receive a confirmation
								email.
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
