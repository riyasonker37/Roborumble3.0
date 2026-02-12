"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isLoginPage = pathname === "/admin/login";
  const isAdmin = user && ["admin", "superadmin"].includes(user.role?.toLowerCase());

  useEffect(() => {
    // If not loading and not on login page and not admin, redirect
    if (!loading && !isLoginPage && !isAdmin) {
      router.push("/admin/login");
    }
  }, [isAdmin, isLoginPage, router, loading]);

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-black w-full text-white">{children}</div>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-[#FF003C]">
        <div className="w-12 h-12 border-4 border-[#FF003C]/30 border-t-[#FF003C] rounded-full animate-spin mb-4" />
        AUTHENTICATING...
      </div>
    );
  }

  // Protected Admin Area Layout
  if (!isAdmin) {
    // Show nothing while redirecting or for unauthorized users
    return null;
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar />
      <div className="flex-1 w-full relative overflow-x-hidden md:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
