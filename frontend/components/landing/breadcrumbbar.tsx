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

function formatSegment(segment: string) {
	return decodeURIComponent(segment)
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export const BreadcrumbBar = () => {
	const pathname = usePathname();

	const segments = pathname.split("/").filter(Boolean);

	return (
		<Breadcrumb className="px-10">
			<BreadcrumbList>
				{/* Home breadcrumb */}
				<BreadcrumbItem>
					{segments.length === 0 ? (
						<BreadcrumbPage>Home</BreadcrumbPage>
					) : (
						<BreadcrumbLink asChild>
							<Link href="/">Home</Link>
						</BreadcrumbLink>
					)}
				</BreadcrumbItem>

				{/* Other segments */}
				{segments.map((segment, index) => {
					const href = "/" + segments.slice(0, index + 1).join("/");
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
	);
};
