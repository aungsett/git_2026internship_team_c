"use client";

import { useState } from "react";
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
export const JobForm = () => {
	const [formData, setFormData] = useState<JobFormData>({
		jobTitle: "",
		jobId: "",
		location: "",
		employmentType: "",
		department: "",
		salaryRange: "",
		experience: "",
		jobDescription: "",
		requiredSkills: [],
		applicationDeadline: "",
		status: "Draft",
	});

	const [skillInput, setSkillInput] = useState("");

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSelectChange = (value: string) => {
		setFormData((prev) => ({
			...prev,
			status: value,
		}));
	};

	const handleAddSkill = () => {
		if (
			skillInput.trim() &&
			!formData.requiredSkills.includes(skillInput.trim())
		) {
			setFormData((prev) => ({
				...prev,
				requiredSkills: [...prev.requiredSkills, skillInput.trim()],
			}));
			setSkillInput("");
		}
	};

	const handleRemoveSkill = (skill: string) => {
		setFormData((prev) => ({
			...prev,
			requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
		}));
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddSkill();
		}
	};

	const handleSaveAsDraft = () => {
		console.log("Saving as draft:", formData);
	};

	const handlePublish = () => {
		console.log("Publishing job:", formData);
	};
	return (
		<form className="flex flex-col gap-6">
			{/* Basic Information Section */}
			<Card className="p-6 border border-gray-200">
				<div className="flex items-center gap-3 mb-6">
					<Briefcase className="w-5 h-5 text-blue-600" />
					<h2 className="text-lg font-semibold text-gray-900">
						Basic Information
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Briefcase className="w-4 h-4 text-gray-500" />
							Job Title
						</label>
						<Input
							type="text"
							name="jobTitle"
							value={formData.jobTitle}
							onChange={handleInputChange}
							placeholder="e.g. Senior Product Designer"
							className="w-full"
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
							className="w-full"
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<MapPin className="w-4 h-4 text-gray-500" />
							Location
						</label>
						<Input
							type="text"
							name="location"
							value={formData.location}
							onChange={handleInputChange}
							placeholder="e.g. Remote, San Francisco"
							className="w-full"
						/>
					</div>
				</div>
			</Card>

			{/* Detailed Info Section */}
			<Card className="p-6 border border-gray-200">
				<div className="flex items-center gap-3 mb-6">
					<Clock className="w-5 h-5 text-blue-600" />
					<h2 className="text-lg font-semibold text-gray-900">
						Detailed Info
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Clock className="w-4 h-4 text-gray-500" />
							Employment Type
						</label>
						<Input
							type="text"
							name="employmentType"
							value={formData.employmentType}
							onChange={handleInputChange}
							placeholder="e.g. Full-time"
							className="w-full"
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Users className="w-4 h-4 text-gray-500" />
							Department
						</label>
						<Input
							type="text"
							name="department"
							value={formData.department}
							onChange={handleInputChange}
							placeholder="e.g. Product Design"
							className="w-full"
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<DollarSign className="w-4 h-4 text-gray-500" />
							Salary Range
						</label>
						<Input
							type="text"
							name="salaryRange"
							value={formData.salaryRange}
							onChange={handleInputChange}
							placeholder="e.g. $120k - $160k"
							className="w-full"
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Zap className="w-4 h-4 text-gray-500" />
							Experience (Years)
						</label>
						<Input
							type="text"
							name="experience"
							value={formData.experience}
							onChange={handleInputChange}
							placeholder="e.g. 5"
							className="w-full"
						/>
					</div>
				</div>
			</Card>

			{/* Content Section */}
			<Card className="p-6 border border-gray-200">
				<div className="flex items-center gap-3 mb-6">
					<FileText className="w-5 h-5 text-blue-600" />
					<h2 className="text-lg font-semibold text-gray-900">
						Content
					</h2>
				</div>
				<div className="space-y-6">
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<FileText className="w-4 h-4 text-gray-500" />
							Job Description
						</label>
						<Textarea
							name="jobDescription"
							value={formData.jobDescription}
							onChange={handleInputChange}
							placeholder="Provide a detailed description of the role, responsibilities, and expectations..."
							rows={6}
							className="w-full resize-none"
						/>
					</div>

					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Zap className="w-4 h-4 text-gray-500" />
							Required Skills
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
			</Card>

			{/* Metadata Section */}
			<Card className="p-6 border border-gray-200">
				<div className="flex items-center gap-3 mb-6">
					<Calendar className="w-5 h-5 text-blue-600" />
					<h2 className="text-lg font-semibold text-gray-900">
						Metadata
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Calendar className="w-4 h-4 text-gray-500" />
							Application Deadline
						</label>
						<Input
							type="date"
							name="applicationDeadline"
							value={formData.applicationDeadline}
							onChange={handleInputChange}
							className="w-full"
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<CheckCircle className="w-4 h-4 text-gray-500" />
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
			</Card>

			{/* Action Buttons */}
			<div className="flex gap-4 justify-end">
				<Button
					type="button"
					onClick={handleSaveAsDraft}
					variant="outline"
					className="px-8 flex items-center gap-2"
				>
					<Home className="w-4 h-4" />
					Save as Draft
				</Button>
				<Button
					type="button"
					onClick={handlePublish}
					className="px-8 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
				>
					<CheckCircle className="w-4 h-4" />
					Publish Job
				</Button>
			</div>
		</form>
	);
};
