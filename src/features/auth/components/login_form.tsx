"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login_schema, login_type } from "../validations/auth_schema";
import Link from "next/link";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<login_type>({
    resolver: zodResolver(login_schema),
    mode: "onBlur",
  });

  const on_submit = async (data: login_type) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Login failed");
        return;
      }

      alert(`Welcome back, ${result.user.full_name}!`);
      // Future step: Redirect to dashboard
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit(on_submit)} className="space-y-5" noValidate>
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`w-full px-3 py-2 border text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className={`w-full px-3 py-2 border text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
        <div className="mt-6 text-center text-sm text-gray-600">
          Do not have an account?{" "}
          <Link 
            href="/sign_up" 
            className="font-medium text-gray-900 hover:text-blue-600 hover:underline transition-colors"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};