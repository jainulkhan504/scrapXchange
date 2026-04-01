import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";   // ✅ correct import

export async function GET() {

  await connectDB();

  const listings = await Listing.find().sort({
    createdAt: -1
  });

  return NextResponse.json(listings);

}