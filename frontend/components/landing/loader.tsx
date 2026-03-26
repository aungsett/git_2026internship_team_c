export const Loader = () => {
	return (
		<div className="w-full">
			<div className="flex flex-col items-center gap-4">
				<div className="relative w-16 h-16">
					<div className="absolute inset-0 rounded-full border-4 border-muted" />
					<div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-700 border-r-blue-700 animate-spin" />
				</div>

				<div className="text-center text-blue-600">
					<p className="font-semibold">Loading...</p>
				</div>
			</div>
		</div>
	);
};
