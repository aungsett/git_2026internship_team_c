"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuth } from "../hooks/useAuth";

function formatSegment(segment: string) {
	const decoded = decodeURIComponent(segment);

	if (decoded.includes("-job-id-")) {
		const title = decoded.split("-job-id-")[0];

		return title
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	if (decoded.includes("=")) {
		const [key, value] = decoded.split("=");

		const formattedKey = key
			.replace(/-/g, " ")
			.replace(/\b\w/g, (c) => c.toUpperCase());

		return `${formattedKey} ${value}`;
	}

	return decoded
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export const BreadcrumbBar = () => {
	const pathname = usePathname();
	const segments = pathname.split("/").filter(Boolean);
	const isDashboardRoute = pathname.startsWith("/dashboard");
	const { isAuthenticated } = useAuth();
	const showDashboardRoot = isAuthenticated && isDashboardRoute;
	const hideChrome =
		pathname === "/" || (showDashboardRoot && pathname === "/dashboard");
	const adjustedSegments = showDashboardRoot ? segments.slice(1) : segments;
	return (
		<>
			{!hideChrome && (
				<Breadcrumb className="pt-[60px] px-4 pb-2">
					<BreadcrumbList>
						{/* Home breadcrumb */}
						<BreadcrumbItem>
							{segments.length === 0 ? (
								<BreadcrumbPage>
									{showDashboardRoot ? "Dashboard" : "Home"}
								</BreadcrumbPage>
							) : (
								<BreadcrumbLink asChild>
									<Link
										href={
											showDashboardRoot
												? "/dashboard"
												: "/"
										}
									>
										{showDashboardRoot
											? "Dashboard"
											: "Home"}
									</Link>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>

						{/* Other segments */}
						{adjustedSegments.map((segment, index) => {
							const href =
								"/" + segments.slice(0, index + 1).join("/");
							const isLast = index === segments.length - 1;

							return (
								<div key={href} className="flex items-center">
									<BreadcrumbSeparator />

									<BreadcrumbItem>
										{isLast ? (
											<BreadcrumbPage>
												{formatSegment(segment)}
											</BreadcrumbPage>
										) : (
											<BreadcrumbLink asChild>
												<Link href={href}>
													{formatSegment(segment)}
												</Link>
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
								</div>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			)}
		</>
	);
};
