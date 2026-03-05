"use client";
import { useState } from "react";
import { Wand2, X } from "lucide-react";

export const Loader = ({
	setParseAI,
}: {
	setParseAI: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const [progress, setProgress] = useState(65);
	const [statusText, setStatusText] = useState(
		"Currently identifying professional summary...",
	);

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
					<h1 className="flex items-center justify-center font-bold text-slate-900 text-xl text-center tracking-[0] leading-7 whitespace-nowrap">
						Importing Candidate Data
					</h1>

					<p className="text-slate-500 text-sm text-center tracking-[0] leading-5">
						We are extracting details from the uploaded CV to
						auto-fill
						<br />
						the form. This usually takes a few seconds.
					</p>
				</div>

				<div
					className="flex flex-col gap-2"
					aria-label="Processing progress"
				>
					<div className="flex items-center justify-between">
						<div
							className="font-bold text-[#135bec] text-xs tracking-[0.60px] leading-4 whitespace-nowrap flex gap-2 items-center"
							aria-label="Status"
						>
							<div
								className="w-1.5 h-1.5 bg-[#135bec] rounded-full"
								aria-hidden="true"
							/>
							PROCESSING CV
						</div>

						<div
							className="font-semibold text-slate-900 text-sm tracking-[0] leading-5 whitespace-nowrap"
							aria-live="polite"
							aria-atomic="true"
						>
							{progress}%
						</div>
					</div>
					<div
						className="w-full h-2 flex bg-slate-100 rounded-full overflow-hidden"
						role="progressbar"
						aria-valuenow={progress}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label="CV processing progress"
					>
						<div
							className="bg-[#135bec] rounded-full transition-all duration-300"
							style={{ width: `${progress}%` }}
						/>
					</div>

					<div
						className="text-slate-400 text-xs text-center tracking-[0] leading-4 whitespace-nowrap"
						aria-live="polite"
						aria-atomic="true"
					>
						{statusText}
					</div>
				</div>

				<button
					className="flex items-center justify-center gap-2 py-2 rounded-lg border border-solid border-slate-200 bg-transparent cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors duration-150"
					type="button"
					aria-label="Cancel parsing process"
					onClick={() => setParseAI(false)}
				>
					<X strokeWidth={0.8} height={20} width={20} />
					<span className="font-semibold text-slate-700 text-sm tracking-[0] leading-5 whitespace-nowrap">
						Cancel Parsing
					</span>
				</button>
			</div>
		</div>
	);
};
