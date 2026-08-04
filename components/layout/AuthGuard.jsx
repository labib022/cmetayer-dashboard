"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { access, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!access || user?.role !== "admin") {
      router.push("/login");
    }
  }, [access, user, router]);

  if (!access || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <p className="text-neutral-400 text-sm">Redirecting to login...</p>
      </div>
    );
  }

  return children;
}