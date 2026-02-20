"use client";

import { useState } from "react";
import { CVUploadSection } from "@/components/applicant/cv-upload-section";
import { ApplicantForm } from "@/components/applicant/applicant-form";

export default function Page() {
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
		acceptTerms: false,
	});

	const [cvFile, setCvFile] = useState<File | null>(null);
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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted:", { ...formData, cv: cvFile });
	};

	return (
		<div className="flex flex-col min-h-screen bg-slate-50">
			<div className="flex-1 w-full px-4 py-8 md:py-12">
				<div className="max-w-4xl mx-auto">
					{/* Title Section */}
					<div className="mb-8">
						<h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
							Apply for Senior Software Engineer
						</h1>
						<p className="text-slate-600">
							Please fill out the form below to submit your
							application. This should take about 5-10 minutes.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* CV Upload Section */}
						<CVUploadSection onFileSelect={setCvFile} />

						<ApplicantForm
							formData={formData}
							handleInputChange={handleInputChange}
						/>

						{/* Submit Button */}
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
						<div className="flex flex-col items-center gap-3">
							<div className="flex flex-col items-center gap-4 w-full">
								<button
									type="submit"
									disabled={!formData.acceptTerms}
									className="w-1/2 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
								>
									Submit Application
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
