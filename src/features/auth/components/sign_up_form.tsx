"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sign_up_schema, sign_up_type } from "../validations/auth_schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api_routes, page_routes } from "../constants/app_constants";

export const SignUpForm = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<sign_up_type>({
    resolver: zodResolver(sign_up_schema),
    mode: "onBlur", // Validates fields when the user leaves the input
  });

  const on_submit = async (data: sign_up_type) => {
  try {
    const response = await fetch(api_routes.auth.sign_up, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Something went wrong");
      return;
    }

    alert("Account created successfully!");
    router.push(page_routes.dashboard)
  } catch (error) {
    console.error("Submission error:", error);
    alert("Failed to connect to the server.");
  }
};

  return (
    <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your details below to get started
        </p>
      </div>

      <form onSubmit={handleSubmit(on_submit)} className="space-y-5" noValidate>
        {/* Full Name Field */}
        <div className="space-y-1">
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="full_name"
            type="text"
            placeholder="John Doe"
            {...register("full_name")}
            className={`w-full px-3 py-2 border text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.full_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.full_name && (
            <p className="text-xs text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
            className={`w-full px-3 py-2 border text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={`w-full px-3 py-2 text-gray-700 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirm_password"
            type="password"
            placeholder="••••••••"
            {...register("confirm_password")}
            className={`w-full px-3 py-2 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.confirm_password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirm_password && (
            <p className="text-xs text-red-500">{errors.confirm_password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="font-medium text-gray-900 hover:text-blue-600 hover:underline transition-colors"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};