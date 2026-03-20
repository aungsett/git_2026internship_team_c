"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
	return (
		<div className="relative">
			<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
			<Input
				placeholder="Search by job title, company, location..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="pl-10"
			/>
		</div>
	);
}
