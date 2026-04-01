import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

/* =========================
   CREATE ORDER
========================= */
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { name, phone, address, pincode, items, total } = body;

    /* =========================
       VALIDATION
    ========================= */
    if (!name || !phone || !address || !pincode) {
      return NextResponse.json(
        { message: "All delivery details are required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!total || total <= 0) {
      return NextResponse.json(
        { message: "Invalid total amount" },
        { status: 400 }
      );
    }

    /* =========================
       GET USER FROM TOKEN
    ========================= */
    const cookie = req.headers.get("cookie") || "";

    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    let userId = null;

    if (token) {
      try {
        const decoded: any = jwt.verify(
          token,
          process.env.JWT_SECRET!
        );
        userId = decoded.userId;
      } catch {
        console.log("Invalid token");
      }
    }

    /* =========================
       SELLER LOGIC
    ========================= */
    const sellerId = items[0]?.sellerId || null;

    /* =========================
       CREATE ORDER
    ========================= */
    const order = await Order.create({
      name,
      phone,
      address,
      pincode,
      items,
      totalAmount: Number(total),
      userId,
      sellerId,
      orderStatus: "Pending",
    });

    return NextResponse.json(
      { message: "Order placed successfully", order },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("ORDER CREATE ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Order failed" },
      { status: 500 }
    );
  }
}

/* =========================
   GET USER ORDERS (FIXED 🔥)
========================= */
export async function GET(req: Request) {
  try {
    await connectDB();

    const cookie = req.headers.get("cookie") || "";

    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json([], { status: 200 });
    }

    let userId = null;

    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET!
      );
      userId = decoded.userId;
    } catch {
      return NextResponse.json([], { status: 200 });
    }

    const orders = await Order.find({ userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(orders);

  } catch (error: any) {
    console.error("FETCH ORDER ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}