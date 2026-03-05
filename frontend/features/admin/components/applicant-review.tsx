"use client";
import { StatusType } from "@/lib/types";
import { ApplicationHeader } from "./application-header";
import { ProfileDetails } from "./profile-details";
import { ResumePreview } from "./resume-preview";
import { SkillsSection } from "./skills-section";
import { useState } from "react";

export const ApplicationReview = () => {
	const [status, setStatus] = useState<StatusType>("Pending");
	const applicationData = {
		applicationNumber: "APP-2024-1284",
		appliedDate: "OCT 24, 2023",
		applicantName: "Johnathan Doe",
		position: "Senior Web Developer Applicant",
		status: {
			label: "Pending Review",
			emoji: "🟡",
			bgColor: "bg-amber-50",
			borderColor: "border-amber-200",
			textColor: "text-amber-700",
		},
		documentUrl:
			"https://res.cloudinary.com/dfff6ltsv/image/upload/v1771394265/ky54au64lww32zl0bsku.pdf",
	};
	const skills = [
		"React/Next.js",
		"TypeScript",
		"Cloud Architecture",
		"Team Leadership",
		"UI/UX Principles",
		"Node.js",
		"GraphQL",
	];
	const profileData = {
		dateOfBirth: "May 12, 1992",
		email: "j.doe.example@domain.com",
		phone: "+91 1234567890",
		workExperience: "8 Years 4 Months",
		residentialAddress: "123 Tech Lane, New Delhi, India",
		highestQualification: "Master of Computer Science",
		collegeUniversity: "Indian Institute of Technology",
		preferredCourse: "Weekend Classes",
		languagesKnown:
			"English (Native), Japanese (Intermediate), Hindi (Conversational)",
		url: "www.johndoe.com",
	};
	return (
		<div className="flex flex-col gap-4 min-h-screen">
			<ApplicationHeader
				applicationNumber={applicationData.applicationNumber}
				appliedDate={applicationData.appliedDate}
				applicantName={applicationData.applicantName}
				position={applicationData.position}
				status={status}
				setStatus={setStatus}
			/>
			<ProfileDetails
				dateOfBirth={profileData.dateOfBirth}
				email={profileData.email}
				phone={profileData.phone}
				workExperience={profileData.workExperience}
				residentialAddress={profileData.residentialAddress}
				highestQualification={profileData.highestQualification}
				collegeUniversity={profileData.collegeUniversity}
				url={profileData.url}
				preferredCourse={profileData.preferredCourse}
				languagesKnown={profileData.languagesKnown}
			/>
			<SkillsSection skills={skills} />
			<ResumePreview documentUrl={applicationData.documentUrl} />
		</div>
	);
};
