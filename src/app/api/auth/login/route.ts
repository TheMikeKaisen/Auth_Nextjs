import { NextResponse } from "next/server";
import { login_schema } from "@/features/auth/validations/auth_schema";
import { auth_service } from "@/features/auth/services/auth_service";
import { app_error } from "@/lib/app_error";
import { http_status } from "@/lib/http_status";
import { cookies } from "next/headers";

// nextjs app router uses two runtimes: edge runtime & node runtime (default: edge)
// edge runtime -> ultra fast lightweight api BUT no native node apis & limited filesystem access
// node runtime -> full backend capabilities, work with ORMs, bcrypt, etc
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation_result = login_schema.safeParse(body);
    if (!validation_result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation_result.error.flatten().fieldErrors },
        { status: http_status.bad_request }
      );
    }

    const {user, access_token, refresh_token} = await auth_service.authenticate_user(validation_result.data);

    const cookie_store = await cookies();
    const is_production = process.env.NODE_ENV === "production";

    // short-lived Access Token cookie
    cookie_store.set({
      name: "access_token",
      value: access_token,
      httpOnly: true,
      secure: is_production,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, 
    });

    // long-lived Refresh Token cookie
    cookie_store.set({
      name: "refresh_token",
      value: refresh_token,
      httpOnly: true,
      secure: is_production,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(
      { message: "Login successful", user },
      { status: http_status.ok }
    );

  } catch (error) {
    if (error instanceof app_error) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status_code }
      );
    }

    console.error("Login controller error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: http_status.internal_server_error }
    );
  }
}