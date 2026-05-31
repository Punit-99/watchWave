import { NextResponse } from "next/server";
import { loginSchema, registerSchema } from "@/validation/auth.validation";
import { loginService, registerService } from "@/services/auth/auth.service";

// REGISTER
export async function registerController(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const result = await registerService(validatedData);

    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: result.user,
      },
      { status: 201 },
    );

    response.cookies.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false, // ✅ IMPORTANT for POSTMAN/local dev
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    response.cookies.set("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}

// LOGIN
export async function loginController(req: Request) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    const result = await loginService(validatedData);

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: result.user,
      },
      { status: 200 },
    );

    response.cookies.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    response.cookies.set("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}
