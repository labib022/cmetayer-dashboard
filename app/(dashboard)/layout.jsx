"use client";

import { useSelector } from "react-redux";
import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/layout/AuthGuard";

export default function DashboardLayout({ children }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-neutral-900">
        <Sidebar user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}