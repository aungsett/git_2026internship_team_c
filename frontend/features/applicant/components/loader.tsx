"use client";
import { useState } from "react";
import { Wand2, X } from "lucide-react";

export const Loader = ({
	setParseAI,
}: {
	setParseAI: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	return (
		<div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen z-[10]">
			<div className="absolute top-0 left-0 inset-0 bg-black bg-opacity-50 backdrop-blur-md w-screen h-screen z-[-1]"></div>
			<div className="relative w-[448px] flex flex-col gap-6 bg-white rounded-xl border border-solid border-slate-200 p-6">
				<div className="relative flex flex-col items-center justify-center h-16">
					<div
						className="border-2 border-slate-300 border-t-2 border-t-blue-600 absolute w-16 h-16 rounded-[50%] animate-spin"
						aria-label="Processing indicator"
					/>
					<Wand2
						className="text-blue-600"
						height={24}
						width={24}
						aria-hidden="true"
					/>
				</div>

				<div className="flex-col items-center gap-2 self-center flex">
					<h1 className="flex items-center justify-center font-bold text-blue-700 text-xl text-center tracking-[0] leading-7 whitespace-nowrap">
						Importing Candidate Data
					</h1>

					<p className="text-slate-600 text-center tracking-[0] leading-5">
						We are extracting details from the uploaded CV to
						auto-fill the form. This usually takes a few seconds.
					</p>
				</div>
			</div>
		</div>
	);
};
