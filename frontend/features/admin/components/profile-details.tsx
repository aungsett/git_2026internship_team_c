import { Github, Globe, Linkedin, Twitter } from "lucide-react";

export const ProfileDetails = ({
	dateOfBirth,
	email,
	phone,
	workExperience,
	residentialAddress,
	highestQualification,
	collegeUniversity,
	url,
	preferredCourse,
	languagesKnown,
}: {
	dateOfBirth: string;
	email: string;
	phone: string;
	workExperience: string;
	residentialAddress: string;
	highestQualification: string;
	collegeUniversity: string;
	url: string;
	preferredCourse: string;
	languagesKnown: string;
}) => {
	const socialLinks = [
		// { icon: <Linkedin />, url: "www.linkedin.in/xyz" },
		// { icon: <Github />, url: "www.github.com/xyz" },
		{
			icon: <Globe width={18} height={18} className="text-slate-600" />,
			url: url,
		},
		// { icon: <Twitter />, url: "www.x.com/xyz" },
	];

	const fields = [
		{
			label: "DATE OF BIRTH",
			value: dateOfBirth,
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
			value: phone,
			color: "text-slate-900",
			left: "left-[615px]",
		},
		{
			label: "WORK EXPERIENCE",
			value: workExperience,
			color: "text-slate-900",
			left: "left-[910px]",
		},
	];

	const secondRowFields = [
		{
			label: "RESIDENTIAL ADDRESS",
			value: residentialAddress,
			color: "text-slate-900",
			left: "left-6",
			width: "w-[calc(100%_-_639px)]",
		},
		{
			label: "HIGHEST QUALIFICATION",
			value: highestQualification,
			color: "text-slate-900",
			left: "left-80",
			width: "w-[calc(100%_-_934px)]",
		},
		{
			label: "COLLEGE/UNIVERSITY",
			value: collegeUniversity,
			color: "text-slate-900",
			left: "left-[616px]",
			width: "w-[calc(100%_-_934px)]",
		},
	];

	return (
		<section className="flex flex-col w-full bg-white rounded-xl border-slate-200 shadow-[0px_1px_2px_#0000000d] border border-solid overflow-hidden">
			<div className="w-full flex-col items-start bg-slate-50 border-b py-4 px-6">
				<h2 className="font-bold text-slate-900 whitespace-nowrap">
					Profile Details
				</h2>
			</div>

			<div className="flex flex-col w-full p-6 gap-6">
				<div className="flex w-full justify-between pr-20">
					{fields.map((field, index) => (
						<div
							key={index}
							className={`flex flex-col items-start gap-[6.5px]`}
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
				<div className="flex w-full justify-between gap-16 pr-20">
					<div className="flex w-full flex-col gap-6 ">
						<div className="flex justify-between gap-6">
							{secondRowFields.map((field, index) => (
								<div
									key={index}
									className={`flex flex-col items-start gap-[6.5px]`}
								>
									<div className="font-bold text-slate-400 text-[10px] tracking-[1.00px] leading-[15px] whitespace-nowrap">
										{field.label}
									</div>

									<p
										className={`font-semibold ${field.color} text-sm tracking-[0] leading-5 whitespace-nowrap`}
									>
										{field.value}
									</p>
								</div>
							))}
						</div>

						<div className="flex justify-between gap-6">
							<div className="flex flex-col items-start gap-[6.5px]">
								<div className="font-bold text-slate-400 text-[10px] tracking-[1.00px] leading-[15px] whitespace-nowrap">
									PREFERRED JAPANESE COURSE
								</div>

								<div className="font-bold text-indigo-600 text-xs tracking-[0] leading-4 whitespace-nowrap bg-indigo-50 px-2 py-1 rounded">
									{preferredCourse}
								</div>
							</div>

							<div className="flex flex-col items-start gap-[6.5px]">
								<div className=" font-bold text-slate-400 text-[10px] tracking-[1.00px] leading-[15px] whitespace-nowrap">
									LANGUAGES KNOWN
								</div>

								<p className="font-semibold text-slate-900 text-sm tracking-[0] leading-5">
									{languagesKnown}
								</p>
							</div>
							<div></div>
						</div>
					</div>

					<div className="flex flex-col items-start gap-[6.5px] px-10">
						<div className="font-bold text-slate-400 text-[10px] tracking-[1.00px] leading-[15px] whitespace-nowrap">
							SOCIAL LINKS
						</div>

						<nav className="flex flex-col items-start gap-[3px]">
							{socialLinks.map((link, index) => (
								<a
									key={index}
									href={`https://${link.url}`}
									className="flex items-center gap-1"
									target="_blank"
									rel="noopener noreferrer"
								>
									{link.icon}

									<div className="font-bold text-[#135bec] text-xs tracking-[0] leading-4 whitespace-nowrap">
										{link.url}
									</div>
								</a>
							))}
						</nav>
					</div>
				</div>
			</div>
		</section>
	);
};
