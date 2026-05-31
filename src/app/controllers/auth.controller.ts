import { NextResponse } from "next/server";

import { loginSchema, registerSchema } from "@/validation/auth.validation";

import { loginService, registerService } from "@/services/auth/auth.service";

// Register
export async function registerController(req: Request) {
  try {
    const body = await req.json();

    const validatedData = registerSchema.parse(body);

    const result = await registerService(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: result,
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 },
    );
  }
}

// Login
export async function loginController(req: Request) {
  try {
    const body = await req.json();

    const validatedData = loginSchema.parse(body);

    const result = await loginService(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: result,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 },
    );
  }
}
