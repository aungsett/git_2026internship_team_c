import { Badge } from "@/components/ui/badge";

export const SkillsSection = ({ skills }: { skills: string[] | null }) => {
	return (
		<section className="flex flex-col w-full bg-white rounded-xl border-slate-200 shadow-[0px_1px_2px_#0000000d] border border-solid overflow-hidden">
			<div className="w-full flex-col items-start bg-slate-50 border-b py-4 px-6">
				<h2 className="font-bold text-slate-900 whitespace-nowrap">
					Skills &amp; Competencies
				</h2>
			</div>

			<div className="flex flex-wrap w-[1150px] items-start gap-[0px_8px] p-6">
				{skills?.map((skill, index) => (
					<Badge
						key={index}
						variant={"outline"}
						className="text-sm bg-slate-100 capitalize"
					>
						{skill}
					</Badge>
				))}
			</div>
		</section>
	);
};
