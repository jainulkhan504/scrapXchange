import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import jwt from "jsonwebtoken";

/* =========================
   GET LISTINGS
========================= */
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get("public");

    // ✅ Marketplace → show ALL
    if (isPublic) {
      const listings = await Listing.find().sort({ createdAt: -1 });
      return NextResponse.json(listings);
    }

    const cookie = req.headers.get("cookie") || "";

    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    // ✅ If no login → show ALL (so old listings visible)
    if (!token) {
      const listings = await Listing.find().sort({ createdAt: -1 });
      return NextResponse.json(listings);
    }

    const secret = process.env.JWT_SECRET!;
    let decoded: any;

    try {
      decoded = jwt.verify(token, secret);
    } catch {
      const listings = await Listing.find().sort({ createdAt: -1 });
      return NextResponse.json(listings);
    }

    // ✅ Show user + old listings (important fix)
    const listings = await Listing.find({
      $or: [
        { userId: decoded.userId },
        { userId: { $exists: false } }, // old data
      ],
    }).sort({ createdAt: -1 });

    return NextResponse.json(listings);

  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

/* =========================
   CREATE LISTING
========================= */
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.title || !body.price) {
      return NextResponse.json(
        { message: "Title and price required" },
        { status: 400 }
      );
    }

    const price = Number(body.price);

    if (isNaN(price)) {
      return NextResponse.json(
        { message: "Invalid price" },
        { status: 400 }
      );
    }

    const cookie = req.headers.get("cookie") || "";

    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    let userId = null;

    try {
      if (token) {
        const decoded: any = jwt.verify(
          token,
          process.env.JWT_SECRET!
        );
        userId = decoded.userId;
      }
    } catch {}

    const listing = await Listing.create({
      title: body.title,
      price,
      unit: body.unit || "kg", // ✅ FIXED
      image: body.image || "",
      status: "active",
      userId,
    });

    return NextResponse.json(listing, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Create failed" },
      { status: 500 }
    );
  }
}