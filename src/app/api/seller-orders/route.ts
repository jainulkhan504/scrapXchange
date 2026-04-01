import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/verifyToken";
import { cookies } from "next/headers";

export async function GET() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json([], { status: 401 });
  }

  const decoded: any = verifyToken(token);

  if (!decoded) {
    return NextResponse.json([], { status: 401 });
  }

  const orders = await Order.find({
    "items.sellerEmail": decoded.email,
  }).sort({ createdAt: -1 });

  return NextResponse.json(orders);
}