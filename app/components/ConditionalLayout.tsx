"use client";

import { usePathname } from "next/navigation";
import AppLayout from "./AppLayout";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Routes that should NOT have the AppLayout (header + drawer)
  const publicRoutes = ["/", "/login", "/register"];

  // If current route is a public route, render children without AppLayout
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Otherwise, wrap with AppLayout
  return <AppLayout>{children}</AppLayout>;
}
