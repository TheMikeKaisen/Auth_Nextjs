import { Metadata } from "next";
import { SignUpForm } from "@/features/auth/components/sign_up_form";

// 1. Define metadata for professional SEO and browser tab titling
export const metadata: Metadata = {
  title: "Sign Up | Your App Name",
  description: "Create a new account to get started with our platform.",
};

// 2. The default export acts as the page route
export default function SignUpPage() {
  return (
    // 3. A minimal, full-screen centering layout using Tailwind CSS
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <SignUpForm />
    </main>
  );
}