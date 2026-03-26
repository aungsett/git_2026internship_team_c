"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	X,
	Briefcase,
	MapPin,
	Clock,
	DollarSign,
	Users,
	FileText,
	Zap,
	Calendar,
	CheckCircle,
	Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

interface JobFormData {
	jobTitle: string;
	jobId: string;
	location: string;
	employmentType: string;
	department: string;
	salaryRange: string;
	experience: string;
	jobDescription: string;
	requiredSkills: string[];
	applicationDeadline: string;
	status: string;
}

export const EditForm = () => {
	// const router = useRouter();
	// const [formData, setFormData] = useState<JobFormData>({
	// 	jobTitle: "",
	// 	jobId: "",
	// 	location: "",
	// 	employmentType: "",
	// 	department: "",
	// 	salaryRange: "",
	// 	experience: "",
	// 	jobDescription: "",
	// 	requiredSkills: [],
	// 	applicationDeadline: "",
	// 	status: "Draft",
	// });
	// const [skillInput, setSkillInput] = useState("");
	// const [loading, setLoading] = useState(false);
	// const [error, setError] = useState("");
	// const [success, setSuccess] = useState(false);
	// const handleChange = (
	// 	e: React.ChangeEvent<
	// 		HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
	// 	>,
	// ) => {
	// 	const { name, value } = e.target;

	// 	setFormData((prev) => ({
	// 		...prev,
	// 		[name]: value,
	// 	}));
	// };
	// const buildPayload = (status: string) => ({
	// 	job_id: formData.jobId,
	// 	title: formData.jobTitle,
	// 	description: formData.jobDescription,
	// 	location: formData.location,
	// 	employment_type: formData.employmentType,
	// 	department: formData.department,
	// 	salary_range: formData.salaryRange,
	// 	experience_required:
	// 		formData.experience.trim() === ""
	// 			? null
	// 			: Number.parseInt(formData.experience, 10),
	// 	skills: formData.requiredSkills,
	// 	application_deadline: formData.applicationDeadline || null,
	// 	status,
	// });
	// const handleInputChange = (
	// 	e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	// ) => {
	// 	const { name, value } = e.target;
	// 	setFormData((prev) => ({ ...prev, [name]: value }));
	// };

	// const handleSelectChange = (value: string) => {
	// 	setFormData((prev) => ({ ...prev, status: value }));
	// };
	// useEffect(() => {
	// 	if (!job) return;

	// 	setFormData({});
	// }, [job]);
	// const handleUpdateJob = async () => {
	// 	setError("");
	// 	setSuccess("");

	// 	const validationError = validateForm();
	// 	if (validationError) {
	// 		setError(validationError);
	// 		return;
	// 	}

	// 	try {
	// 		setLoading(true);

	// 		const res = await fetch(`/admin/jobs/${jobId}`, {
	// 			method: "PUT",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({
	// 				title: formData.title,
	// 				description: formData.description,
	// 				location: formData.location,
	// 				salary: formData.salary,
	// 				application_deadline: formData.deadline,
	// 				status: formData.status,
	// 			}),
	// 		});

	// 		const data = await res.json();

	// 		if (!res.ok) {
	// 			throw new Error(data.error || "Failed to update job");
	// 		}

	// 		setSuccess("Job updated successfully");

	// 		// optional: refetch or redirect
	// 		// router.push("/admin/jobs");
	// 	} catch (err: any) {
	// 		setError(err.message);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };
	// const isChanged =
	// 	JSON.stringify(formData) !==
	// 	JSON.stringify({
	// 		title: job?.title || "",
	// 		description: job?.description || "",
	// 		location: job?.location || "",
	// 		salary: job?.salary || "",
	// 		deadline: job?.application_deadline || "",
	// 		status: job?.status || "draft",
	// 	});
	return (
		<form className="flex flex-col gap-6">
			{/* Basic Information */}
			{/* <Card className="p-6 border border-gray-200">
				<div className="flex items-center gap-3 mb-6">
					<Briefcase className="w-5 h-5 text-blue-600" />
					<h2 className="text-lg font-semibold text-gray-900">
						Basic Information
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Briefcase className="w-4 h-4 text-gray-500" /> Job
							Title
						</label>
						<Input
							type="text"
							name="jobTitle"
							value={formData.jobTitle}
							onChange={handleInputChange}
							placeholder="e.g. Senior Product Designer"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Job ID
						</label>
						<Input
							type="text"
							name="jobId"
							value={formData.jobId}
							onChange={handleInputChange}
							placeholder="e.g. DES-2024-001"
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<MapPin className="w-4 h-4 text-gray-500" />{" "}
							Location
						</label>
						<Input
							type="text"
							name="location"
							value={formData.location}
							onChange={handleInputChange}
							placeholder="e.g. Remote, San Francisco"
						/>
					</div>
				</div>
			</Card> */}

			{/* Detailed Info */}
			{/* <Card className="p-6 border border-gray-200">
				<div className="flex items-center gap-3 mb-6">
					<Clock className="w-5 h-5 text-blue-600" />
					<h2 className="text-lg font-semibold text-gray-900">
						Detailed Info
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Clock className="w-4 h-4 text-gray-500" />{" "}
							Employment Type
						</label>
						<Input
							type="text"
							name="employmentType"
							value={formData.employmentType}
							onChange={handleInputChange}
							placeholder="e.g. Full-time"
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Users className="w-4 h-4 text-gray-500" />{" "}
							Department
						</label>
						<Input
							type="text"
							name="department"
							value={formData.department}
							onChange={handleInputChange}
							placeholder="e.g. Product Design"
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<DollarSign className="w-4 h-4 text-gray-500" />{" "}
							Salary Range
						</label>
						<Input
							type="text"
							name="salaryRange"
							value={formData.salaryRange}
							onChange={handleInputChange}
							placeholder="e.g. $120k - $160k"
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Zap className="w-4 h-4 text-gray-500" /> Experience
							(Years)
						</label>
						<Input
							type="number"
							inputMode="numeric"
							min={0}
							step={1}
							name="experience"
							value={formData.experience}
							onChange={handleInputChange}
							placeholder="e.g. 0"
						/>
					</div>
				</div>
			</Card> */}

			{/* Content */}
			{/* <Card className="p-6 border border-gray-200">
				<div className="flex items-center gap-3 mb-6">
					<FileText className="w-5 h-5 text-blue-600" />
					<h2 className="text-lg font-semibold text-gray-900">
						Content
					</h2>
				</div>
				<div className="space-y-6">
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<FileText className="w-4 h-4 text-gray-500" /> Job
							Description
						</label>
						<Textarea
							name="jobDescription"
							value={formData.jobDescription}
							onChange={handleInputChange}
							placeholder="Provide a detailed description..."
							rows={6}
							className="w-full resize-none"
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Zap className="w-4 h-4 text-gray-500" /> Required
							Skills
						</label>
						<div className="flex gap-2 mb-4">
							<Input
								type="text"
								value={skillInput}
								onChange={(e) => setSkillInput(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Add a skill..."
								className="flex-1"
							/>
							<Button
								type="button"
								onClick={handleAddSkill}
								variant="outline"
								className="px-4"
							>
								Add
							</Button>
						</div>
						<div className="flex flex-wrap gap-2">
							{formData.requiredSkills.map((skill) => (
								<div
									key={skill}
									className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
								>
									{skill}
									<button
										type="button"
										onClick={() => handleRemoveSkill(skill)}
										className="ml-1 hover:text-blue-900 transition-colors"
									>
										<X className="w-4 h-4" />
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			</Card> */}

			{/* Metadata */}
			{/* <Card className="p-6 border border-gray-200">
				<div className="flex items-center gap-3 mb-6">
					<Calendar className="w-5 h-5 text-blue-600" />
					<h2 className="text-lg font-semibold text-gray-900">
						Metadata
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Calendar className="w-4 h-4 text-gray-500" />{" "}
							Application Deadline
						</label>
						<Input
							type="date"
							name="applicationDeadline"
							value={formData.applicationDeadline}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<CheckCircle className="w-4 h-4 text-gray-500" />{" "}
							Status
						</label>
						<Select
							value={formData.status}
							onValueChange={handleSelectChange}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Draft">Draft</SelectItem>
								<SelectItem value="Published">
									Published
								</SelectItem>
								<SelectItem value="Closed">Closed</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</Card> */}

			{/* {error && (
				<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
					<p className="text-sm text-red-700">{error}</p>
				</div>
			)} */}

			{/* Action Buttons */}
			{/* <div className="flex gap-4 justify-end">
				<Button
					type="button"
					onClick={() => handleSubmit("Draft")}
					disabled={loading}
					variant="outline"
					className="px-8 flex items-center gap-2"
				>
					<Home className="w-4 h-4" />
					{loading ? "Saving..." : "Save as Draft"}
				</Button>
				<Button
					type="button"
					onClick={() => handleSubmit("Published")}
					disabled={loading}
					className="px-8 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
				>
					<CheckCircle className="w-4 h-4" />
					{loading ? "Publishing..." : "Publish Job"}
				</Button>
			</div> */}
		</form>
	);
};
