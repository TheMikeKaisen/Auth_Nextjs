"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api_routes } from "../constants/app_constants";

export const LogoutButton = () => {
  const router = useRouter();
  const [is_logging_out, set_is_logging_out] = useState(false);

  const handle_logout = async () => {
    set_is_logging_out(true);
    try {
      await fetch(api_routes.auth.logout, { method: "POST" });
      
      router.push(api_routes.auth.login);
      
      // Force Next.js to clear the server cache so the dashboard doesn't flash
      router.refresh(); 
    } catch (error) {
      console.error("Logout failed:", error);
      set_is_logging_out(false);
    }
  };

  return (
    <button
      onClick={handle_logout}
      disabled={is_logging_out}
      className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
    >
      {is_logging_out ? "Signing out..." : "Sign out"}
    </button>
  );
};