import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sign_up_schema } from "@/features/auth/validations/auth_schema";
import { auth_service } from "@/features/auth/services/auth_service";
import { app_error } from "@/lib/app_error";
import { http_status } from "@/lib/http_status";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation_result = sign_up_schema.safeParse(body);
    if (!validation_result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation_result.error.flatten().fieldErrors },
        { status: http_status.bad_request }
      );
    }


    const { user, access_token, refresh_token } = await auth_service.register_new_user(validation_result.data);

    const cookie_store = await cookies();
    const is_production = process.env.NODE_ENV === "production";

    // short-lived Access Token
    cookie_store.set({
      name: "access_token",
      value: access_token,
      httpOnly: true,     
      secure: is_production, 
      sameSite: "lax",    
      path: "/",          
      maxAge: 60 * 15, 
    });

    // long-lived Refresh Token
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
      { 
        message: "Account created and logged in successfully", 
        user 
      },
      { status: http_status.created }
    );

  } catch (error) {
    if (error instanceof app_error) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status_code }
      );
    }

    console.error("Sign up controller error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: http_status.internal_server_error }
    );
  }
}