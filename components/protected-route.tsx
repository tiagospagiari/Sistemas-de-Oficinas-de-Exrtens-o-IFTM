"use client";

import type React from "react";

import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/") {
      router.push("/");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-iftm-lightGray">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-iftm-green"></div>
      </div>
    );
  }

  if (!user && pathname !== "/") {
    return null;
  }

  return <>{children}</>;
}
