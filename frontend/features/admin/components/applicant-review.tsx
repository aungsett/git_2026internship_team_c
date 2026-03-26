"use client";
import { ApplicationHeader } from "./application-header";
import { ProfileDetails } from "./profile-details";
import { ResumePreview } from "./resume-preview";
import { SkillsSection } from "./skills-section";
import { useApplicantDetails } from "@/features/hooks/useApplicantDetails";
import { Loader } from "@/components/landing/loader";

export const ApplicationReview = ({ appId }: { appId: string }) => {
	const { loading, error, applicant } = useApplicantDetails(appId);
	if (loading) {
		return (
			<main className="min-h-screen bg-gray-50 flex items-center justify-center">
				<Loader />
			</main>
		);
	}

	if (error) {
		return (
			<main className="min-h-screen bg-gray-50 flex items-center justify-center">
				<p className="text-red-500">{error}</p>
			</main>
		);
	}
	return (
		<div className="flex flex-col gap-4 min-h-screen">
			<ApplicationHeader applicant={applicant} />
			<ProfileDetails applicant={applicant} />
			<SkillsSection skills={applicant.skills} />
			<ResumePreview documentUrl={applicant.document_url} />
		</div>
	);
};
