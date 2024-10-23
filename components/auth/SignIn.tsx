"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/context/AuthProvider";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const { login } = useAuthContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to login");
      }

      login(data.token); // Use localStorage token to manage login

      if (isMounted) {
        router.push(redirectUrl); // Redirect after login
      }
    } catch (error) {
      setError("Login failed");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="p-4 bg-white text-black shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email:
          </label>
          <input
            id="email"
            type="email"
            className="p-2 border border-gray-300 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password:
          </label>
          <input
            id="password"
            type="password"
            className="p-2 border border-gray-300 rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition"
        >
          Sign In
        </button>
        <p className="mt-4">
          Don&#39;t have an account?{" "}
          <Link className="text-red-500" href="/register">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
