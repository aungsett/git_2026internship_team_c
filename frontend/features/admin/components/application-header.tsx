import { Download, GraduationCap, Save } from "lucide-react";
import { StatusUpdate } from "./status-update";
import { StatusType } from "@/lib/types";
import { Button } from "@/components/ui/button";
export const ApplicationHeader = ({
	applicationNumber,
	appliedDate,
	applicantName,
	position,
	status,
	setStatus,
}: {
	applicationNumber: string;
	appliedDate: string;
	applicantName: string;
	position: string;
	status: StatusType;
	setStatus: (status: StatusType) => void;
}) => {
	return (
		<div className="flex items-center justify-between relative bg-white rounded-xl w-full p-6 border border-solid shadow-[0px_1px_2px_#0000000d]">
			<div className="inline-flex flex-col items-start gap-1">
				<div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
					<p className="font-bold text-slate-500 text-xs tracking-[1.20px] leading-4 whitespace-nowrap">
						APPLICATION #{applicationNumber}
					</p>

					<span
						className="text-slate-300 text-base tracking-[0] leading-6 whitespace-nowrap"
						aria-hidden="true"
					>
						|
					</span>

					<p className="font-medium text-slate-500 text-xs tracking-[1.20px] leading-4 whitespace-nowrap">
						APPLIED: {appliedDate}
					</p>
				</div>

				<h1 className="font-extrabold text-slate-900 text-3xl tracking-[0] leading-[37.5px] whitespace-nowrap">
					{applicantName}
				</h1>

				<div className="flex items-center gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
					<GraduationCap width="18" className="text-slate-500" />

					<p className="font-medium text-slate-500 text-base tracking-[0] leading-6 whitespace-nowrap">
						{position}
					</p>
				</div>
			</div>

			<div className="flex flex-col items-end gap-2">
				<div className="font-bold text-slate-400 text-[10px] tracking-[0.50px] leading-[15px] whitespace-nowrap">
					APPLICATION REVIEW STATUS
				</div>

				<StatusUpdate value={status} onChange={setStatus} />
				<div className="flex items-center gap-2">
					<Button
						variant={"outline"}
						className="flex gap-2 items-center"
						onClick={() => {
							// Implement download functionality here
							window.open(
								"https://res.cloudinary.com/dfff6ltsv/image/upload/v1771394265/ky54au64lww32zl0bsku.pdf",
								"_blank",
							);
						}}
					>
						{" "}
						<Download /> Download Resume
					</Button>
					<Button
						disabled
						className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700"
					>
						<Save />
						Save Changes
					</Button>
				</div>
			</div>
		</div>
	);
};
