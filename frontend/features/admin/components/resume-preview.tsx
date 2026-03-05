export const ResumePreview = ({ documentUrl }: { documentUrl: string }) => {
	return (
		<section className="flex flex-col w-full bg-white rounded-xl border-slate-200 shadow-[0px_1px_2px_#0000000d] border border-solid overflow-hidden">
			<div className="w-full flex-col items-start bg-slate-50 border-b py-4 px-6">
				<h2 className="font-bold text-slate-900 whitespace-nowrap">
					Resume &amp; Preview
				</h2>
			</div>
			<iframe src={documentUrl} className="min-h-screen"></iframe>
		</section>
	);
};
