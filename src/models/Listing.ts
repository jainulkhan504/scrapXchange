import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    // ✅ UNIT FIX
    unit: {
      type: String,
      default: "kg",
    },

    image: {
      type: String,
      default: "",
    },

    // ✅ IMPORTANT: NOT required (so old listings still work)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Listing ||
  mongoose.model("Listing", ListingSchema);