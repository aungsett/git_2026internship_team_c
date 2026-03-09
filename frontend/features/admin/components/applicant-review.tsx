"use client";
import { StatusType } from "@/lib/types";
import { ApplicationHeader } from "./application-header";
import { ProfileDetails } from "./profile-details";
import { ResumePreview } from "./resume-preview";
import { SkillsSection } from "./skills-section";
import { useState } from "react";
import { useApplicantDetails } from "@/features/hooks/useApplicantDetails";

export const ApplicationReview = ({ appId }: { appId: string }) => {
	const [status, setStatus] = useState<StatusType>("Pending");
	const { loading, error, applicant } = useApplicantDetails(appId);
	if (loading) {
		return (
			<main className="min-h-screen bg-gray-50 flex items-center justify-center">
				<p className="text-gray-500">Loading application...</p>
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
			<ApplicationHeader
				applicant={applicant}
				position={"Software Engineer"}
				status={status}
				setStatus={setStatus}
			/>
			<ProfileDetails applicant={applicant} />
			<SkillsSection skills={applicant.skills} />
			<ResumePreview documentUrl={applicant.document_url} />
		</div>
	);
};
