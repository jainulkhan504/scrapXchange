import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    /* =========================
       VALIDATION
    ========================= */
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    /* =========================
       FIND USER
    ========================= */
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    /* =========================
       PASSWORD CHECK
    ========================= */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    /* =========================
       JWT TOKEN
    ========================= */
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role || "user",
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    /* =========================
       RESPONSE + COOKIE (FINAL FIX)
    ========================= */
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // ✅ CORRECT WAY (WORKS IN NEXT.JS)
    response.cookies.set("token", token, {
      httpOnly: true,      // secure
      secure: false,       // keep false in dev
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}