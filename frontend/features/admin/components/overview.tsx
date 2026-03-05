"use client";
import {
	Calendar,
	ChartColumnStacked,
	Hourglass,
	TrendingUp,
} from "lucide-react";

interface StatCard {
	title: string;
	value: string;
	icon: JSX.Element;
	subtitle: string;
	subtitleColor: string;
}

export const Overview = () => {
	const statCards: StatCard[] = [
		{
			title: "TOTAL APPLIED",
			value: "1,284",
			icon: (
				<TrendingUp className="text-green-600" height={16} width={16} />
			),
			subtitle: "+12% from last month",
			subtitleColor: "text-green-500",
		},
		{
			title: "IN PIPELINE",
			value: "432",
			icon: (
				<Hourglass className="text-[#135bec]" height={16} width={16} />
			),
			subtitle: "68 needs review",
			subtitleColor: "text-[#135bec]",
		},
		{
			title: "INTERVIEWS",
			value: "18",
			icon: <Calendar className="text-blue-600" height={16} width={16} />,
			subtitle: "4 scheduled today",
			subtitleColor: "text-blue-500",
		},
		{
			title: "CLOSING RATE",
			value: "24.5%",
			icon: (
				<ChartColumnStacked
					className="text-slate-500"
					height={16}
					width={16}
				/>
			),
			subtitle: "Across all departments",
			subtitleColor: "text-slate-400",
		},
	];

	return (
		<div className="left-80 flex flex-col gap-8">
			<section
				className="flex justify-between items-center gap-6"
				aria-label="Application statistics"
			>
				{statCards.map((card, index) => (
					<article
						key={index}
						className={`w-full bg-white rounded-xl border border-solid border-slate-200 shadow-[0px_1px_2px_#0000000d] p-6 flex flex-col`}
					>
						<h3 className="font-bold text-slate-500 text-xs tracking-[1.20px] leading-4 whitespace-nowrap">
							{card.title}
						</h3>

						<div className="font-bold text-slate-900 text-3xl tracking-[0] leading-9 whitespace-nowrap">
							{card.value}
						</div>
						<div className="flex items-center gap-2 mt-4">
							{card.icon}

							<div
								className={`${card.subtitleColor} text-xs tracking-[0] leading-4 whitespace-nowrap`}
							>
								{card.subtitle}
							</div>
						</div>
					</article>
				))}
			</section>
		</div>
	);
};
