"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/landing/header";
import { BreadcrumbBar } from "@/components/landing/breadcrumbbar";
import { Footer } from "@/components/landing/footer";

// Routes where the global header / footer should NOT appear
const HIDDEN_ON = ["/login", "/dashboard"];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = HIDDEN_ON.some((route) => pathname.startsWith(route));

  return (
    <>
      {!hideChrome && <Header />}
      {!hideChrome && <BreadcrumbBar />}
      <div className={!hideChrome ? "pt-[72.8px]" : ""}>
        {children}
      </div>
      {!hideChrome && <Footer />}
    </>
  );
}
