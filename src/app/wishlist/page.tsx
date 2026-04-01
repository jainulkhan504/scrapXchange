"use client";

import { useEffect, useState } from "react";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    setItems(stored);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-8">
        Wishlist ❤️
      </h1>

      {items.length === 0 ? (
        <div>No wishlist items.</div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded shadow"
            >
              <h2 className="font-bold">{item.title}</h2>
              <p>₹ {item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}