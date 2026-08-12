"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useVerifyOtpMutation,
  useSendOtpMutation,
} from "@/lib/redux/features/auth/authApi";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: resending }] = useSendOtpMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Missing email. Please restart the reset password process.");
      return;
    }

    try {
      const res = await verifyOtp({ email, otp }).unwrap();
      const tokenParam = res?.reset_token
        ? `&reset_token=${encodeURIComponent(res.reset_token)}`
        : "";
      router.push(`/reset-password?email=${encodeURIComponent(email)}${tokenParam}`);
    } catch (err) {
      setError(err?.data?.message || "Invalid or expired OTP");
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    try {
      await sendOtp({ email }).unwrap();
      setMessage("A new code has been sent to your email");
    } catch (err) {
      setError(err?.data?.message || "Failed to resend code");
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

        {/* Verify OTP card */}
        <div className="relative z-20 -mt-6 mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Verify code</h2>
            <p className="text-sm text-neutral-500 mt-1">
              {email
                ? `Enter the code sent to ${email}`
                : "Enter the code sent to your email"}
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-4">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1.5">
                Verification code<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="mt-2 bg-linear-to-r from-purple-600 to-fuchsia-600 hover:opacity-90 transition-opacity cursor-pointer text-white rounded-md py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {verifying ? "Verifying..." : "Verify code"}
            </button>
          </form>

          <div className="flex items-center justify-between mt-5 text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || !email}
              className="text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50 cursor-pointer"
            >
              {resending ? "Resending..." : "Resend code"}
            </button>
            <Link
              href="/login"
              className="text-neutral-500 hover:text-neutral-700"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}