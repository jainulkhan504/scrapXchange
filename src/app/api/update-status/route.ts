import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

/* =========================
   UPDATE ORDER STATUS
========================= */
export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { message: "ID and status required" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: status.toLowerCase() }, // ✅ normalize
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Order status updated",
      order: updatedOrder,
    });

  } catch (error: any) {
    console.error("STATUS UPDATE ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Update failed" },
      { status: 500 }
    );
  }
}