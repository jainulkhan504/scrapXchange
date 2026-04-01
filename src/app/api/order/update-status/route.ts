import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PUT(req: Request) {

  await connectDB();

  const body = await req.json();

  const { orderId, status } = body;

  const updated = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: status },
    { new: true }
  );

  return NextResponse.json(updated);
}