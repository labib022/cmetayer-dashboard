"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSignInMutation } from "@/lib/redux/features/auth/authApi";
import { setCredentials } from "@/lib/redux/features/auth/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signIn, { isLoading }] = useSignInMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn({ email, password }).unwrap();

      if (result.user.role !== "admin") {
        setError("This account does not have admin access.");
        return;
      }

      dispatch(setCredentials({ access: result.access, user: result.user }));
      router.push("/");
    } catch (err) {
      setError(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 w-80 flex flex-col gap-4"
      >
        <div className="text-center mb-2">
          <h1 className="text-lg font-medium text-white">Cmetayer admin</h1>
          <p className="text-sm text-neutral-400 mt-1">Sign in to manage the platform</p>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className="text-sm text-neutral-400 block mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white text-sm outline-none focus:border-neutral-500"
          />
        </div>

        <div>
          <label className="text-sm text-neutral-400 block mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white text-sm outline-none focus:border-neutral-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-white text-black rounded-md py-2 text-sm font-medium mt-2 disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}