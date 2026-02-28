"use client";

import { useState } from "react";
import { Upload, File, X, Stars } from "lucide-react";

interface CVUploadSectionProps {
	onFileSelect: (file: File | null) => void;
}

export const CVUploadSection = ({ onFileSelect }: CVUploadSectionProps) => {
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [error, setError] = useState<string>("");

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const validateFile = (file: File): boolean => {
		const maxSize = 5 * 1024 * 1024; // 5MB
		const allowedTypes = [
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		];

		if (file.size > maxSize) {
			setError("File size must be less than 5MB");
			return false;
		}

		if (!allowedTypes.includes(file.type)) {
			setError("Only PDF and Word documents are accepted");
			return false;
		}

		return true;
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		setError("");

		const droppedFile = e.dataTransfer.files[0];
		if (droppedFile && validateFile(droppedFile)) {
			setFile(droppedFile);
			onFileSelect(droppedFile);
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		setError("");
		const selectedFile = e.target.files?.[0];
		if (selectedFile && validateFile(selectedFile)) {
			setFile(selectedFile);
			onFileSelect(selectedFile);
		}
	};

	const handleRemoveFile = () => {
		setFile(null);
		setError("");
		onFileSelect(null);
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return (
			Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
		);
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-slate-900 mb-2">
					Upload Your CV
				</h2>
				<div className="bg-slate-200 uppercase text-[10px] text-slate-700 py-1 px-2 rounded-full border border-slate-300 flex items-center gap-1">
					<Stars
						size={14}
						color="#2563eb"
						className="inline-block mr-1 fill-blue-600 outline-blue-600"
					/>
					Powered by AI
				</div>
			</div>
			{!file && (
				<p className="text-sm text-slate-600 mb-4">
					Please upload your CV in PDF or Word format (max 5MB)
				</p>
			)}

			{!file ? (
				<div
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={`border-2 border-dashed rounded-lg p-8 md:p-12 text-center transition-all ${
						isDragging
							? "border-blue-500 bg-blue-50"
							: "border-slate-300 bg-slate-50 hover:border-slate-400"
					}`}
				>
					<div className="flex flex-col items-center gap-4">
						<div
							className={`rounded-full p-3 ${isDragging ? "bg-blue-100" : "bg-slate-100"}`}
						>
							<Upload
								size={32}
								className={
									isDragging
										? "text-blue-600"
										: "text-slate-600"
								}
							/>
						</div>

						<div>
							<p className="text-base font-medium text-slate-900">
								Drag and drop your CV here
							</p>
							<p className="text-sm text-slate-600 mt-1">
								or click to browse your computer
							</p>
						</div>

						<label className="mt-4">
							<span className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
								Choose File
							</span>
							<input
								type="file"
								accept=".pdf,.doc,.docx"
								onChange={handleFileSelect}
								className="hidden"
							/>
						</label>

						<p className="text-xs text-slate-500 mt-4">
							Accepted formats: PDF, DOC, DOCX (Max 5MB)
						</p>
					</div>
				</div>
			) : (
				<div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between border border-slate-200">
					<div className="flex items-center gap-3">
						<div className="bg-blue-100 p-2 rounded-lg">
							<File size={24} className="text-blue-600" />
						</div>
						<div>
							<p className="font-medium text-slate-900 truncate">
								{file.name}
							</p>
							<p className="text-sm text-slate-600">
								{formatFileSize(file.size)}
							</p>
						</div>
					</div>
					<button
						onClick={handleRemoveFile}
						className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
						type="button"
						aria-label="Remove file"
					>
						<X size={20} className="text-slate-600" />
					</button>
				</div>
			)}

			{error && (
				<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
					<p className="text-sm text-red-700">{error}</p>
				</div>
			)}
		</div>
	);
};
