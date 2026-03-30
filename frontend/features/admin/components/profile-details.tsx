import { formatDate } from "@/features/hooks/useJobDetails";
import { Applicant } from "@/lib/types";
import { Globe } from "lucide-react";

export const ProfileDetails = ({ applicant }: { applicant: Applicant }) => {
	const {
		date_of_birth,
		email,
		phone_number,
		work_experience,
		address,
		qualification,
		college,
		social_links,
		preferred_japanese_course,
		language,
		professional_summary,
		comments,
	} = applicant;

	const fields = [
		{
			label: "DATE OF BIRTH",
			value: formatDate(date_of_birth + "") + "",
			color: "text-slate-900",
			left: "left-6",
		},
		{
			label: "EMAIL ADDRESS",
			value: email,
			color: "text-[#135bec]",
			left: "left-80",
		},
		{
			label: "PHONE NUMBER",
			value: phone_number,
			color: "text-slate-900",
			left: "left-[615px]",
		},
		{
			label: "WORK EXPERIENCE",
			value:
				work_experience +
				(work_experience != null && work_experience > 1
					? " years"
					: " year"),
			color: "text-slate-900",
			left: "left-[910px]",
		},
	];

	const secondRowFields = [
		{
			label: "RESIDENTIAL ADDRESS",
			value: address,
			color: "text-slate-900",
			left: "left-6",
			width: "w-[calc(100%_-_639px)]",
		},
		{
			label: "HIGHEST QUALIFICATION",
			value: qualification,
			color: "text-slate-900",
			left: "left-80",
			width: "w-[calc(100%_-_934px)]",
		},
		{
			label: "COLLEGE/UNIVERSITY",
			value: college,
			color: "text-slate-900",
			left: "left-[616px]",
			width: "w-[calc(100%_-_934px)]",
		},
	];

	return (
		<section className="flex flex-col w-full bg-white rounded-xl shadow-[0px_1px_2px_#0000000d] border border-solid overflow-hidden">
			<div className="w-full flex-col items-start bg-slate-50 border-b py-4 px-6">
				<h2 className="font-bold text-slate-900 whitespace-nowrap">
					Profile Details
				</h2>
			</div>

			<div className="flex flex-col w-full p-6 gap-6">
				<div className="flex w-full justify-between pr-20 gap-6">
					{fields.map((field, index) => (
						<div
							key={index}
							className={`flex flex-col items-start gap-[6.5px] flex-1`}
						>
							<div className="font-bold text-slate-400 text-[10px] tracking-[1.00px] leading-[15px] whitespace-nowrap">
								{field.label}
							</div>

							<div
								className={`font-semibold ${field.color} text-sm tracking-[0] leading-5`}
							>
								{field.value}
							</div>
						</div>
					))}
				</div>
				<div className="flex flex-col w-full justify-between gap-6 pr-20">
					<div className="flex justify-between gap-6">
						{secondRowFields.map((field, index) => (
							<div
								key={index}
								className={`flex flex-col items-start gap-[6.5px] flex-1`}
							>
								<div className="font-bold text-slate-400 text-[10px] tracking-[1.00px] leading-[15px] whitespace-nowrap">
									{field.label}
								</div>

								<p
									className={`font-semibold ${field.color} text-sm tracking-[0] leading-5 whitespace-nowrap capitalize`}
								>
									{field.value}
								</p>
							</div>
						))}
						<div className="flex flex-col items-start gap-[6.5px] flex-1">
							<div className="font-bold text-slate-400 text-[10px] tracking-[1.00px] leading-[15px] whitespace-nowrap">
								SOCIAL LINKS
							</div>

							<nav className="flex flex-col items-start gap-[3px]">
								{social_links?.map((link, index) => (
									<a
										key={index}
										href={link}
										className="flex items-center gap-1"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Globe
											width={18}
											height={18}
											className="text-slate-600"
										/>

										<div className="font-bold text-[#135bec] text-xs tracking-[0] leading-4 whitespace-nowrap">
											{link}
										</div>
									</a>
								))}
							</nav>
						</div>
					</div>
					<div className="flex justify-between gap-6">
						<div className="flex flex-col items-start gap-[6.5px] flex-[0.95]">
							<div className="font-bold text-slate-400 text-[10px] tracking-[1.00px] leading-[15px] whitespace-nowrap">
								PREFERRED JAPANESE COURSE
							</div>

							<div className="font-bold text-indigo-600 text-xs tracking-[0] leading-4 whitespace-nowrap bg-indigo-50 px-2 py-1 rounded capitalize">
								{preferred_japanese_course}
							</div>
						</div>

						<div className="flex flex-col items-start gap-[6.5px]  flex-[3]">
							<div className=" font-bold text-slate-400 text-[10px] tracking-[1.00px] leading-[15px] whitespace-nowrap">
								LANGUAGES KNOWN
							</div>

							<p className="font-semibold text-slate-900 text-sm tracking-[0] leading-5">
								{language?.map((lang, index) => (
									<span key={index}>
										{lang}
										{index < language.length - 1
											? ", "
											: ""}
									</span>
								))}
							</p>
						</div>
					</div>
				</div>

				{/* Professional Summary Section */}
				{professional_summary && (
					<div className="flex flex-col gap-2 pt-4 border-t">
						<h3 className="font-bold text-slate-400 text-[10px] tracking-[1.00px] leading-[15px] uppercase">
							AI Generated Summary
						</h3>
						<p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
							{professional_summary}
						</p>
					</div>
				)}

				{/* Applicant Comments Section */}
				{comments && (
					<div className="flex flex-col gap-2 pt-4 border-t">
						<h3 className="font-bold text-slate-400 text-[10px] tracking-[1.00px] leading-[15px] uppercase">
							Applicant Comments / Additional Notes
						</h3>
						<p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-md border whitespace-pre-wrap">
							{comments}
						</p>
					</div>
				)}

			</div>
		</section>
	);
};
