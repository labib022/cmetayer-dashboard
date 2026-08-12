"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/lib/redux/features/auth/authApi";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const resetToken = searchParams.get("reset_token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Missing email. Please restart the reset password process.");
      return;
    }

    if (!resetToken) {
      setError("Your reset session is missing or expired. Please verify your OTP again.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        email,
        new_password: newPassword,
        confirm_password: confirmPassword,
        reset_token: resetToken,
      }).unwrap();
      router.push("/login");
    } catch (err) {
      setError(err?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-2xl">
        {/* Purple banner with wavy bottom */}
        <div className="relative rounded-t-2xl overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-purple-600 via-purple-600 to-fuchsia-700" />

          {/* Decorative overlay - no external asset needed */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white_0%,transparent_35%),radial-gradient(circle_at_80%_60%,white_0%,transparent_30%)]" />

          <div className="relative z-10 flex flex-col items-center justify-center gap-3 py-14 px-6">
            <h1 className="text-3xl font-bold tracking-wide text-white">Hello Welcome!</h1>
            <p className="flex items-center gap-2 text-lg text-white/90">

            </p>
          </div>

        </div>

        {/* Reset password card */}
        <div className="relative z-20 -mt-6 mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Set new password</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Choose a new password for your account
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1.5">
                New password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1.5">
                Confirm password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 bg-linear-to-r from-purple-600 to-fuchsia-600 hover:opacity-90 transition-opacity cursor-pointer text-white rounded-md py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Reset password"}
            </button>
          </form>

          <Link
            href="/login"
            className="block text-center text-sm text-neutral-500 hover:text-neutral-700 mt-5"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}