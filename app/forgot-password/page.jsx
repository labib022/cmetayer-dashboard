"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSendOtpMutation } from "@/lib/redux/features/auth/authApi";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [sendOtp, { isLoading }] = useSendOtpMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await sendOtp({ email }).unwrap();
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err?.data?.message || "Failed to send OTP");
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
          </div>

        </div>

        {/* Forgot password card */}
        <div className="relative z-20 -mt-6 mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Forgot password</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Enter your email to receive a code
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
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourcompany.com"
                required
                className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 bg-linear-to-r from-purple-600 to-fuchsia-600 hover:opacity-90 transition-opacity cursor-pointer text-white rounded-md py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send code"}
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