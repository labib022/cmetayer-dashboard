"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { useSignInMutation } from "@/lib/redux/features/auth/authApi";
// NOTE: adjust this import/action name to match your actual auth slice
import { setCredentials } from "@/lib/redux/features/auth/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const [signIn, { isLoading }] = useSignInMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await signIn({ email, password }).unwrap();

      if (res.user.role !== "admin") {
        setError("This account does not have admin access.");
        return;
      }

      dispatch(
        setCredentials({
          access: res.access,
          refresh: res.refresh,
          user: res.user,
        })
      );

      // NOTE: app/(dashboard)/page.jsx is a route group, so its actual
      // URL is "/", not "/dashboard". Redirect to "/" to match your structure.
      router.push("/");
    } catch (err) {
      if (err?.status === "FETCH_ERROR") {
        setError(
          "Can't reach the server. Please check your connection or try again later."
        );
      } else {
        setError(err?.data?.message || "Invalid email or password");
      }
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

        {/* Login card */}
        <div className="relative z-20 -mt-6 mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">LogIn</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Please login to admin dashboard
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

            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1.5">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2.5 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-purple-600 focus:ring-purple-500"
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 bg-linear-to-r from-purple-600 to-fuchsia-600 hover:opacity-90 transition-opacity cursor-pointer text-white rounded-md py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}