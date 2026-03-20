import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	BellRing,
	BrainCircuit,
	CheckCircle2,
	FileText,
	Filter,
	MessagesSquare,
	PlusCircle,
	Rocket,
	Share,
	UserRoundX,
	Wand2,
	Zap,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<main className="min-h-screen w-full pt-[40px] overflow-hidden">
			{/* Hero Section */}
			<section className="w-full min-h-screen relative flex items-center">
				<div className="absolute inset-0 z-[-1]">
					<div className="absolute -top-[10%] -right-[5%] w-[60%] h-[100%] bg-blue-200 rounded-full blur-[120px]"></div>
				</div>
				<div className="w-full flex flex-col gap-12 items-center justify-center py-20 ">
					<Badge
						variant={"outline"}
						className="text-blue-700 border-blue-700 bg-white px-5 rounded-full text-base font-semibold tracking-wide capitalize"
					>
						The Future of Talent
					</Badge>
					<p className="text-7xl font-semibold text-center">
						The Future of
						<br />
						<span className="text-blue-700 italic font-bold">
							Hiring{" "}
						</span>
						Redefined
					</p>
					<p className="text-lg text-center leading-relaxed max-w-xl">
						Streamline your recruitment process from application to
						hire. AI-powered parsing for applicants, and powerful
						management tools for admins.
					</p>
					<div className="flex flex-wrap gap-4 pt-4">
						<Link href="/login">
							<Button
								size={"lg"}
								className="bg-blue-600 border border-blue-600 text-white hover:text-blue-600 hover:bg-slate-50 transition-all"
							>
								Start Hiring
							</Button>
						</Link>
						<Link href="/jobs">
							<Button
								size={"lg"}
								variant={"outline"}
								className="border-blue-600 text-blue-600 bg-slate-50 hover:text-white hover:bg-blue-600 transition-all"
							>
								Apply for a Job
							</Button>
						</Link>
					</div>
				</div>
			</section>

			<section className="py-28">
				<div className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-10">
					<div className="flex flex-col items-center gap-4">
						<Badge
							variant="secondary"
							className="text-base font-semibold !bg-blue-200 text-blue-800 w-fit"
						>
							For the Recruiter
						</Badge>
						<h2 className="text-5xl font-extrabold">
							Built for{" "}
							<span className="text-blue-700">Precision</span>{" "}
							Hiring
						</h2>
						<p className="text-on-surface-variant">
							Powerful tools designed to cut through the noise and
							find your next star hire faster.
						</p>
					</div>
					<div className="flex gap-6 h-[400px]">
						<div className="bg-blue-100 w-full rounded-3xl p-12 flex flex-col justify-between overflow-hidden relative group border shadow-lg">
							<div className="z-10 flex flex-col gap-4">
								<h3 className="text-3xl font-bold">
									Centralized Dashboard
								</h3>
								<p className="text-on-surface-variant max-w-md">
									Manage every stage of your recuitment cycle
									in a single, high-fidelity interface with
									specialised overview.
								</p>
							</div>
							<div className="relative mt-8 z-10 self-end w-full md:w-[80%]">
								<img
									alt="Dashboard Preview"
									className="rounded-2xl shadow-2xl border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 object-contain "
									data-alt="Clean software dashboard showing colorful data charts"
									src="/admin-dashboard.png"
								/>
							</div>
						</div>
						<div className="bg-white min-w-[464px] w-[464px] rounded-3xl p-10 flex flex-col gap-6 justify-between text-on-primary border shadow-lg">
							<div className="flex flex-col gap-4">
								<Filter className="w-8 h-8 text-blue-700 fill-blue-700" />
								<h3 className="text-3xl font-bold">
									Advanced Filtering
								</h3>
								<p className="text-on-primary-container leading-relaxed">
									Search through thousands of applicants
									instantly using multi-layered boolean search
									and skill-based tags.
								</p>
							</div>
							<div className="flex gap-4 flex-wrap">
								<Badge
									variant="outline"
									className="bg-blue-100 text-blue-700 border-none text-base"
								>
									Experience
								</Badge>
								<Badge
									variant="outline"
									className="bg-blue-100 text-blue-700 border-none text-base"
								>
									Skills
								</Badge>
								<Badge
									variant="outline"
									className="bg-blue-100 text-blue-700 border-none text-base"
								>
									Salary
								</Badge>
							</div>
						</div>
					</div>
					<div className="flex gap-6">
						<div className="bg-white min-w-[464px] w-[464px] rounded-3xl p-10 flex flex-col gap-6 justify-center border shadow-lg">
							<Share className="w-12 h-12 text-blue-700 bg-blue-100 rounded-xl p-2" />
							<h3 className="text-3xl font-bold">
								Easy CSV Export
							</h3>
							<p className="text-on-surface-variant">
								Download your candidate data with a single click
								for offline reporting or external processing.
							</p>
						</div>
						<div className="bg-blue-100 w-full rounded-3xl p-10 flex items-center justify-between gap-8 group border shadow-lg">
							<div className="flex flex-col gap-4">
								<h3 className="text-3xl font-bold whitespace-nowrap">
									Easy Job Creation
								</h3>
								<p className="text-on-surface-variant">
									Add jobs using simple and minimal interface,
									with zero-wait time. Ready to publish at
									once.
								</p>
							</div>
							<div className="relative flex items-center justify-center">
								<div className="w-32 h-20 bg-white rounded-xl border border-outline-variant shadow-md flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
									<div className="absolute top-2 left-2 flex gap-1">
										<div className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
										<div className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
									</div>
									<PlusCircle />
									<div className="absolute bottom-0 right-0 p-2 bg-blue-600/20 rounded-tl-xl">
										<Rocket />
									</div>
								</div>
								<div
									className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full border border-outline-variant shadow-md flex items-center justify-center animate-bounce text-primary"
									style={{ animationDuration: "3s" }}
								>
									<CheckCircle2 className="fill-blue-600 text-white w-10 h-10" />
								</div>
							</div>
						</div>
					</div>
					<Link href="/login">
						<button className="bg-blue-600 rounded-full text-white text-lg font-semibold py-3 px-7 border-2 border-blue-600  hover:bg-white hover:text-blue-600 transition-all">
							Start Hiring
						</button>
					</Link>
				</div>
			</section>

			<section className="py-28">
				<div className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-10">
					<div className="text-center space-y-4">
						<Badge
							variant="secondary"
							className="text-base font-semibold !bg-blue-200 text-blue-800 w-fituppercase"
						>
							For the Applicant
						</Badge>
						<h2 className="text-5xl font-extrabold">
							Apply in{" "}
							<span className="text-blue-700">seconds</span>, not
							hours.
						</h2>
						<p className="text-on-surface-variant max-w-2xl mx-auto">
							We've removed the friction from job hunting so you
							can focus on finding your dream role.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
						<div className="space-y-6 border shadow-lg p-8 rounded-3xl bg-blue-100">
							<UserRoundX className="w-12 h-12 text-blue-700 bg-white rounded-xl p-2" />
							<h3 className="text-2xl font-bold text-on-surface">
								No Signup Required
							</h3>
							<p className="text-on-surface-variant leading-relaxed">
								Skip the long onboarding flows. Apply directly
								to any position without the need to create or
								manage another account.
							</p>
						</div>
						<div className="space-y-6 border shadow-lg p-8 rounded-3xl">
							<Wand2 className="w-12 h-12 text-blue-700 bg-blue-100 rounded-xl p-2" />
							<h3 className="text-2xl font-bold text-on-surface">
								AI-Powered CV Parsing
							</h3>
							<p className="text-on-surface-variant leading-relaxed">
								Our advanced AI intelligently extracts your
								experience, education, and skills to auto-fill
								forms instantly and accurately.
							</p>
						</div>
						<div className="space-y-6 border shadow-lg p-8 rounded-3xl bg-blue-100">
							<BellRing className="w-12 h-12 text-blue-700 bg-white rounded-xl p-2" />
							<h3 className="text-2xl font-bold text-on-surface">
								Instant Notifications
							</h3>
							<p className="text-on-surface-variant leading-relaxed">
								Stay informed with automatic email confirmations
								and real-time status updates as your application
								moves through the review stages.
							</p>
						</div>
					</div>
					<Link href="/jobs">
						<button className="bg-blue-600 rounded-full text-white text-lg font-semibold py-3 px-7 border-2 border-blue-600  hover:bg-white hover:text-blue-600 transition-all">
							Apply for a Job
						</button>
					</Link>
				</div>
			</section>

			<section className="py-28 bg-white border-y border-outline-variant">
				<div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
					<div className="relative">
						<div className="bg-blue-100 rounded-3xl p-8 border border-outline-variant shadow-inner">
							<div className="bg-white rounded-2xl p-6 shadow-xl border border-outline-variant rotate-[-2deg] hover:rotate-0 transition-all">
								<div className="flex items-center justify-between mb-8">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-blue-100 rounded-lg" />
										<div className="h-3 w-32 bg-slate-100 rounded-full" />
									</div>
									<div className="h-5 w-16 bg-blue-100 rounded-full" />
								</div>
								<div className="space-y-4">
									<div className="h-14 w-full bg-slate-50 border border-slate-100 rounded-lg flex items-center px-4 gap-4">
										<FileText className="fill-blue-700 text-white w-7 h-7" />
										<div className="h-2 w-48 bg-slate-200 rounded-full" />
									</div>
									<div className="h-14 w-full bg-blue-50 rounded-lg flex items-center px-4 justify-between border border-primary/10">
										<div className="flex items-center gap-4">
											<Wand2 className="text-blue-700" />
											<div className="h-2 w-40 bg-blue-200 rounded-full" />
										</div>
										<div className="h-2 w-10 bg-blue-200 rounded-full" />
									</div>
									<div className="h-32 w-full bg-slate-50 border border-slate-100 rounded-lg p-5">
										<div className="h-2 w-full bg-slate-200 rounded-full mb-3" />
										<div className="h-2 w-full bg-slate-200 rounded-full mb-3" />
										<div className="h-2 w-3/4 bg-slate-200 rounded-full" />
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="space-y-8">
						<Badge
							variant="secondary"
							className="text-base font-semibold !bg-blue-200 text-blue-800 w-fit"
						>
							The Kinetic Flow
						</Badge>
						<h2 className="text-5xl font-extrabold">
							Refined{" "}
							<span className="text-blue-700">architectural</span>{" "}
							recruitment.
						</h2>
						<div className="space-y-8">
							<div className="flex gap-6">
								<div className="w-14 h-14 shrink-0 bg-white border border-outline-variant rounded-xl flex items-center justify-center shadow-sm">
									<BrainCircuit className="text-blue-700" />
								</div>
								<div>
									<h4 className="font-bold text-xl mb-1 tracking-tight">
										Deep Talent Analysis
									</h4>
									<p className="text-on-surface-variant font-medium">
										Our system doesn't just read resumes; it
										understands context, tenure, and skill
										progression.
									</p>
								</div>
							</div>
							<div className="flex gap-6">
								<div className="w-14 h-14 shrink-0 bg-white border border-outline-variant rounded-xl flex items-center justify-center shadow-sm">
									<MessagesSquare className="text-blue-700" />
								</div>
								<div>
									<h4 className="font-bold text-xl mb-1 tracking-tight">
										Structured Interviews
									</h4>
									<p className="text-on-surface-variant font-medium">
										Standardize your evaluation process with
										integrated scorecards and bias-reduction
										tools.
									</p>
								</div>
							</div>
							<div className="flex gap-6">
								<div className="w-14 h-14 shrink-0 bg-white border border-outline-variant rounded-xl flex items-center justify-center shadow-sm">
									<Zap className="text-blue-700" />
								</div>
								<div>
									<h4 className="font-bold text-xl mb-1 tracking-tight">
										Velocity Recruiting
									</h4>
									<p className="text-on-surface-variant font-medium">
										Cut time-to-hire by 40% with automated
										interview scheduling and candidate
										follow-ups.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-20">
				<div className="max-w-5xl mx-auto px-8 text-center bg-blue-700 text-white rounded-[3rem] py-24 relative overflow-hidden">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
					<div className="relative z-10 flex flex-col gap-8">
						<h2 className="text-4xl md:text-5xl font-extrabold text-on-primary tracking-tight">
							Ready to build your team?
						</h2>
						<p className="text-primary-container text-lg max-w-xl mx-auto">
							Join hundreds of companies scaling their culture
							with Architectural ATS.
						</p>
						<Link href="/login">
							<button className="bg-white rounded-full text-blue-700 text-lg font-semibold py-3 px-7 border-2 border-white  hover:bg-transparent hover:text-white transition-all">
								Get Started Now
							</button>
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
