"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ListingDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        const data = await res.json();
        setItem(data);
      } catch {
        console.log("Failed to load item");
      }
    };

    if (id) fetchItem();
  }, [id]);

  const addToCart = () => {
    const existing = JSON.parse(localStorage.getItem("cart") || "[]");

    const found = existing.find((i: any) => i._id === item._id);

    let updated;

    if (found) {
      updated = existing.map((i: any) =>
        i._id === item._id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      updated = [...existing, { ...item, quantity: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updated));

    window.dispatchEvent(new Event("cartUpdated"));

    alert("Added to cart 🛒");
  };

  if (!item) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-10">

      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div>
          {item.image ? (
            <img
              src={item.image}
              className="w-full h-96 object-cover rounded-xl"
            />
          ) : (
            <div className="h-96 flex items-center justify-center bg-gray-100 rounded-xl">
              No Image
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div>

          <h1 className="text-3xl font-bold mb-3">
            {item.title}
          </h1>

          <p className="text-2xl text-green-600 font-bold mb-4">
            ₹ {item.price}/{item.unit || "kg"}
          </p>

          {/* CATEGORY */}
          {item.category && (
            <p className="text-gray-600 mb-2">
              📦 Category: {item.category}
            </p>
          )}

          {/* LOCATION */}
          {item.location && (
            <p className="text-gray-600 mb-2">
              📍 Location: {item.location}
            </p>
          )}

          {/* STOCK */}
          {item.stock && (
            <p className="text-gray-600 mb-4">
              📊 Available: {item.stock}
            </p>
          )}

          {/* DESCRIPTION */}
          {item.description && (
            <div className="mb-5">
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-gray-700">
                {item.description}
              </p>
            </div>
          )}

          {/* SELLER INFO */}
          <div className="bg-gray-100 p-4 rounded mb-5">
            <p className="font-semibold">
              Seller: Verified Scrap Dealer ✅
            </p>
            <p className="text-sm text-gray-600">
              Contact will be shared after order
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={addToCart}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Add to Cart 🛒
          </button>

        </div>

      </div>

    </div>
  );
}