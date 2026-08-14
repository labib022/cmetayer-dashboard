"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { hydrateAuth } from "@/lib/redux/features/auth/authSlice";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { access, user, hydrated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (hydrated && (!access || user?.role !== "admin")) {
      router.push("/login");
    }
  }, [hydrated, access, user, router]);

  if (!hydrated || !access || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <p className="text-neutral-400 text-sm">Loading...</p>
      </div>
    );
  }

  return children;
}