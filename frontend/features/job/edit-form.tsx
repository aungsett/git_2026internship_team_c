"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	X, Briefcase, MapPin, Clock, DollarSign, Users,
	FileText, Zap, Calendar, CheckCircle, Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

interface JobFormData {
	id: number;
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

export const EditForm = ({ slug }: { slug: string }) => {
	const router = useRouter();
	const [formData, setFormData] = useState<JobFormData>({
		id: 0,
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
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	// Extract job_id from slug — format: "some-title-job-id-JOB123"
	const extractJobId = (slug: string) => {
		const parts = slug.split("-job-id-");
		return parts.length > 1 ? parts[1].toUpperCase() : slug;
	};

	useEffect(() => {
		const fetchJob = async () => {
			try {
				const jobId = extractJobId(slug);
				const result = await api.getSingleJob(jobId);
				const job = result.data;
				setFormData({
					id: job.id,
					jobTitle: job.title || "",
					jobId: job.job_id || "",
					location: job.location || "",
					employmentType: job.employment_type || "",
					department: job.department || "",
					salaryRange: job.salary_range || "",
					experience: job.experience_required != null ? String(job.experience_required) : "",
					jobDescription: job.description || "",
					requiredSkills: job.skills || [],
					applicationDeadline: job.application_deadline || "",
					status: job.status || "Draft",
				});
			} catch (err: any) {
				setError(err.message || "Failed to load job");
			} finally {
				setFetching(false);
			}
		};
		fetchJob();
	}, [slug]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (value: string) => {
		setFormData((prev) => ({ ...prev, status: value }));
	};

	const handleAddSkill = () => {
		if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
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

	const handleSubmit = async () => {
		setError("");
		if (!formData.jobTitle) {
			setError("Job title is required.");
			return;
		}
		setLoading(true);
		try {
			await api.updateJob(formData.id, {
				title: formData.jobTitle,
				description: formData.jobDescription,
				location: formData.location,
				salary: formData.salaryRange,
				status: formData.status.toLowerCase(),
			});
			setSuccess(true);
			setTimeout(() => router.push("/dashboard/jobs"), 1500);
		} catch (err: any) {
			setError(err.message || "Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	if (fetching) {
		return <p className="text-gray-500">Loading job details...</p>;
	}

	if (success) {
		return (
			<div className="flex flex-col items-center justify-center py-20">
				<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
					<CheckCircle className="w-8 h-8 text-green-600" />
				</div>
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Job Updated!</h2>
				<p className="text-gray-600">Redirecting...</p>
			</div>
		);
	}

	return (
		<form className="flex flex-col gap-6">
			{/* Basic Information */}
			<Card className="p-6 border border-gray-200">
				<div className="flex items-center gap-3 mb-6">
					<Briefcase className="w-5 h-5 text-blue-600" />
					<h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Briefcase className="w-4 h-4 text-gray-500" /> Job Title
						</label>
						<Input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} placeholder="e.g. Senior Product Designer" />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Job ID</label>
						<Input type="text" name="jobId" value={formData.jobId} disabled className="bg-gray-100 cursor-not-allowed" />
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<MapPin className="w-4 h-4 text-gray-500" /> Location
						</label>
						<Input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Remote, San Francisco" />
					</div>
				</div>
			</Card>

			{/* Detailed Info */}
			<Card className="p-6 border border-gray-200">
				<div className="flex items-center gap-3 mb-6">
					<Clock className="w-5 h-5 text-blue-600" />
					<h2 className="text-lg font-semibold text-gray-900">Detailed Info</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Clock className="w-4 h-4 text-gray-500" /> Employment Type
						</label>
						<Input type="text" name="employmentType" value={formData.employmentType} onChange={handleInputChange} placeholder="e.g. Full-time" />
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Users className="w-4 h-4 text-gray-500" /> Department
						</label>
						<Input type="text" name="department" value={formData.department} onChange={handleInputChange} placeholder="e.g. Product Design" />
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<DollarSign className="w-4 h-4 text-gray-500" /> Salary Range
						</label>
						<Input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleInputChange} placeholder="e.g. $120k - $160k" />
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Zap className="w-4 h-4 text-gray-500" /> Experience (Years)
						</label>
						<Input type="text" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="e.g. 5" />
					</div>
				</div>
			</Card>

			{/* Content */}
			<Card className="p-6 border border-gray-200">
				<div className="flex items-center gap-3 mb-6">
					<FileText className="w-5 h-5 text-blue-600" />
					<h2 className="text-lg font-semibold text-gray-900">Content</h2>
				</div>
				<div className="space-y-6">
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<FileText className="w-4 h-4 text-gray-500" /> Job Description
						</label>
						<Textarea name="jobDescription" value={formData.jobDescription} onChange={handleInputChange} placeholder="Provide a detailed description..." rows={6} className="w-full resize-none" />
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Zap className="w-4 h-4 text-gray-500" /> Required Skills
						</label>
						<div className="flex gap-2 mb-4">
							<Input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Add a skill..." className="flex-1" />
							<Button type="button" onClick={handleAddSkill} variant="outline" className="px-4">Add</Button>
						</div>
						<div className="flex flex-wrap gap-2">
							{formData.requiredSkills.map((skill) => (
								<div key={skill} className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
									{skill}
									<button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-1 hover:text-blue-900 transition-colors">
										<X className="w-4 h-4" />
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			</Card>

			{/* Metadata */}
			<Card className="p-6 border border-gray-200">
				<div className="flex items-center gap-3 mb-6">
					<Calendar className="w-5 h-5 text-blue-600" />
					<h2 className="text-lg font-semibold text-gray-900">Metadata</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Calendar className="w-4 h-4 text-gray-500" /> Application Deadline
						</label>
						<Input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleInputChange} />
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<CheckCircle className="w-4 h-4 text-gray-500" /> Status
						</label>
						<Select value={formData.status} onValueChange={handleSelectChange}>
							<SelectTrigger><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="Draft">Draft</SelectItem>
								<SelectItem value="Published">Published</SelectItem>
								<SelectItem value="Closed">Closed</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</Card>

			{error && (
				<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
					<p className="text-sm text-red-700">{error}</p>
				</div>
			)}

			{/* Action Buttons */}
			<div className="flex gap-4 justify-end">
				<Button type="button" onClick={() => router.push("/dashboard/jobs")} variant="outline" className="px-8">
					Cancel
				</Button>
				<Button type="button" onClick={handleSubmit} disabled={loading} className="px-8 bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
					<CheckCircle className="w-4 h-4" />
					{loading ? "Saving..." : "Save Changes"}
				</Button>
			</div>
		</form>
	);
};
