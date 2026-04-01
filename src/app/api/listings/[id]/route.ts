import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import jwt from "jsonwebtoken";

/* =========================
   GET USER FROM TOKEN
========================= */
const getUserIdFromReq = (req: Request) => {
  const cookie = req.headers.get("cookie") || "";

  const token = cookie
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );
    return decoded.userId;
  } catch {
    return null;
  }
};

/* =========================
   GET SINGLE LISTING
========================= */
export async function GET(req: Request) {
  try {
    await connectDB();

    const id = req.url.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { message: "Invalid ID" },
        { status: 400 }
      );
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}

/* =========================
   UPDATE LISTING
========================= */
export async function PUT(req: Request) {
  try {
    await connectDB();

    const userId = getUserIdFromReq(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = req.url.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { message: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const listing = await Listing.findById(id);

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    // ✅ FIXED (allow old listings OR owner)
    if (listing.userId && listing.userId.toString() !== userId) {
      return NextResponse.json(
        { message: "Not allowed" },
        { status: 403 }
      );
    }

    listing.title = body.title;
    listing.price = Number(body.price);
    listing.unit = body.unit || "kg";
    listing.image = body.image || "";
    listing.status = body.status || "active";

    await listing.save();

    return NextResponse.json(listing);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE LISTING
========================= */
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const userId = getUserIdFromReq(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = req.url.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { message: "Invalid ID" },
        { status: 400 }
      );
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    // ✅ FIXED (allow old listings OR owner)
    if (listing.userId && listing.userId.toString() !== userId) {
      return NextResponse.json(
        { message: "Not allowed" },
        { status: 403 }
      );
    }

    await listing.deleteOne();

    return NextResponse.json({
      message: "Deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Delete failed" },
      { status: 500 }
    );
  }
}