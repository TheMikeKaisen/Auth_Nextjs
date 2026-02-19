import { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login_form";

export const metadata: Metadata = {
  title: "Login | Your App Name",
  description: "Sign in to your account.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </main>
  );
}