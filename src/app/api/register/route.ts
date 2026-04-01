import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    /* =========================
       VALIDATION
    ========================= */

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Name validation (only letters)
    if (!/^[A-Za-z ]+$/.test(name)) {
      return NextResponse.json(
        { message: "Name should contain only letters" },
        { status: 400 }
      );
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password validation (strong)
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    /* =========================
       NORMALIZE EMAIL
    ========================= */
    const normalizedEmail = email.toLowerCase();

    /* =========================
       CHECK EXISTING USER
    ========================= */
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    /* =========================
       HASH PASSWORD
    ========================= */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* =========================
       CREATE USER
    ========================= */
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user", // ✅ FUTURE READY (seller/admin later)
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: user._id,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}