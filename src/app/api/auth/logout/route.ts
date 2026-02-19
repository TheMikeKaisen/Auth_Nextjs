import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { token_utils } from "@/lib/jwt_utils";
import { refresh_token_repository } from "@/features/auth/repositories/refresh_token_repository";
import { http_status } from "@/lib/http_status";

export const runtime = "nodejs";

export async function POST() {
  try {
    const cookie_store = await cookies();
    const refresh_token = cookie_store.get("refresh_token")?.value;

    if (refresh_token) {
      const token_hash = token_utils.hash_refresh_token(refresh_token);
      const stored_token = await refresh_token_repository.find_token_by_hash(token_hash);
      
      if (stored_token) {
        await refresh_token_repository.delete_token(stored_token.id);
      }
    }

    cookie_store.delete("access_token");
    cookie_store.delete("refresh_token");

    return NextResponse.json(
      { message: "Logged out successfully" }, 
      { status: http_status.ok }
    );

  } catch (error) {
    console.error("Logout controller error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: http_status.internal_server_error }
    );
  }
}