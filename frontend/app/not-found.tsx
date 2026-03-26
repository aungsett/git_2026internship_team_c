import { Compass, Search } from "lucide-react";

export default function NotFound() {
	return (
		<div className="w-full text-center flex flex-col gap-12 items-center justify-center h-screen">
			{/* <div className="relative inline-block group">
				<div className="absolute inset-0 bg-blue-200 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700"></div>
				<div className="relative flex items-center justify-center">
					<div className="w-64 h-64 bg-surface-container-lowest rounded-[2rem] glass-card flex items-center justify-center shadow-2xl rotate-3 transform transition-transform hover:rotate-0 duration-500">
						<Compass />
					</div>
					<div className="absolute -bottom-8 -right-8 w-32 h-32 bg-surface-container-high rounded-full glass-card flex items-center justify-center shadow-xl -rotate-6 md:flex">
						<Search />
					</div>
				</div>
			</div> */}
			<div className="space-y-4">
				<h1 className="font-headline text-5xl md:text-[12rem] font-extrabold tracking-tighter text-blue-700 leading-none">
					404
				</h1>
				<h2 className="font-headline text-2xl md:text-4xl font-bold text-on-surface tracking-tight">
					Page not found
				</h2>
				<p className="max-w-md mx-auto font-body text-on-surface-variant text-lg leading-relaxed">
					Oops! This page has drifted off course. Let's get you back
					on track.
				</p>
			</div>
		</div>
	);
}
