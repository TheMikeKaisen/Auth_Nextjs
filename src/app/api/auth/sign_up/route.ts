import { NextResponse } from "next/server";
import { sign_up_schema } from "@/features/auth/validations/auth_schema";
import { auth_service } from "@/features/auth/services/auth_service";
import { app_error } from "@/lib/app_error";
import { http_status } from "@/lib/http_status";
import { cookies } from "next/headers";
import { jwt_utils } from "@/lib/jwt_utils";

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
    const { email, full_name } = validation_result.data;
    const user_id = await auth_service.register_new_user(validation_result.data);
    const token = await jwt_utils.sign_token({
      user_id: user_id,
      email: email,
    });

    const cookie_store = await cookies();
    cookie_store.set({
      name: "auth_session",
      value: token,
      httpOnly: true,     
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",    
      path: "/",          
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(
      { 
        message: "Account created and logged in successfully", 
        user: { id: user_id, full_name, email } 
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