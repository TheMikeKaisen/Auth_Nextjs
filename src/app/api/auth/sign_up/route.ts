import { NextResponse } from "next/server";
import { sign_up_schema } from "@/features/auth/validations/auth_schema";
import { auth_service } from "@/features/auth/services/auth_service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation_result = sign_up_schema.safeParse(body);
    if (!validation_result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation_result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Simply hand the validated data to the service layer
    const user_id = await auth_service.register_new_user(validation_result.data);

    return NextResponse.json(
      { message: "User created successfully", user_id },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof Error && error.message === "user_exists") {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    console.error("Sign up controller error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}