import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { name, phone, address, pincode, items, total } = body;

    // ✅ VALIDATION
    if (!name || !phone || !address || !pincode) {
      return NextResponse.json(
        { message: "User details required" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      name,
      phone,
      address,
      pincode,
      items,
      total, // ✅ FIXED (NO totalAmount)
      status: "pending",
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error: any) {
    console.error("CHECKOUT ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}