"use client";
import { StatusType } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface StatusSelectProps {
	value: StatusType;
	onChange: (value: StatusType) => void;
	disabled?: boolean;
}

const getStatusColor = (status: StatusType) => {
	switch (status) {
		case "Pending":
			return {
				bg: "bg-yellow-50",
				border: "border-yellow-200",
				text: "text-yellow-700",
				circle: "bg-yellow-400",
				label: "text-yellow-800",
			};
		case "Shortlisted":
			return {
				bg: "bg-green-50",
				border: "border-green-200",
				text: "text-green-700",
				circle: "bg-green-400",
				label: "text-green-800",
			};
		case "Interviewed":
			return {
				bg: "bg-blue-50",
				border: "border-blue-200",
				text: "text-blue-700",
				circle: "bg-blue-400",
				label: "text-blue-800",
			};
		case "Rejected":
			return {
				bg: "bg-red-50",
				border: "border-red-200",
				text: "text-red-700",
				circle: "bg-red-400",
				label: "text-red-800",
			};
		default:
			return {
				bg: "bg-gray-50",
				border: "border-gray-200",
				text: "text-gray-700",
				circle: "bg-gray-400",
				label: "text-gray-800",
			};
	}
};

const STATUS_OPTIONS: StatusType[] = [
	"Pending",
	"Shortlisted",
	"Rejected",
	"Interviewed",
];

export const StatusUpdate = ({
	value,
	onChange,
	disabled = false,
}: StatusSelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const colors = getStatusColor(value);

	return (
		<div className="relative w-fit">
			<button
				onClick={() => setIsOpen(!isOpen)}
				disabled={disabled}
				className={`w-full rounded-xl border-2 px-4 py-1 flex items-center justify-between gap-3 font-medium transition-all ${colors.bg} ${colors.border} ${colors.label} hover:shadow-md ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
			>
				<div className="flex items-center gap-2">
					<div className={`h-2 w-2 rounded-full ${colors.circle}`} />
					<span>{value}</span>
				</div>
				<ChevronDown
					className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg z-10">
					{STATUS_OPTIONS.map((status) => {
						const statusColors = getStatusColor(status);
						return (
							<button
								key={status}
								onClick={() => {
									onChange(status);
									setIsOpen(false);
								}}
								className={`w-full px-4 py-3 flex items-center gap-3 font-medium transition-colors hover:bg-gray-50 ${
									status === value
										? `${statusColors.bg} ${statusColors.label}`
										: "text-gray-700"
								} first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0`}
							>
								<div
									className={`h-2 w-2 rounded-full ${statusColors.circle}`}
								/>
								<span>{status}</span>
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};
