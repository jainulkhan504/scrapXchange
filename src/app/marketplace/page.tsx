"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface Listing {
  _id: string;
  title: string;
  price: number;
  status: string;
  image?: string;
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  // ✅ NEW: force UI refresh trigger
  const [cartTrigger, setCartTrigger] = useState(0);

  useEffect(() => {
    fetch("/api/listings?public=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const cleaned = data.map((item: any) => ({
            ...item,
            price: Number(item.price) || 0,
          }));
          setListings(cleaned);
        }
      });
  }, []);

  // ✅ NEW: listen for cart updates
  useEffect(() => {
    const update = () => {
      setCartTrigger((prev) => prev + 1);
    };

    window.addEventListener("cartUpdated", update);

    return () => {
      window.removeEventListener("cartUpdated", update);
    };
  }, []);

  const filteredListings = useMemo(() => {
    let result = [...listings];

    result = result.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }
    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [listings, search, sort, cartTrigger]); // ✅ include trigger

  const addToCart = (item: Listing) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((i: any) => i._id === item._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        _id: item._id,
        title: item.title,
        price: item.price,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // ✅ FORCE UPDATE EVERYWHERE
    window.dispatchEvent(new Event("cartUpdated"));

    // ✅ UX feedback (no refresh needed)
    console.log("Added to cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Scrap Marketplace ♻️
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">

          <input
            type="text"
            placeholder="Search scrap materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 border rounded-lg"
          >
            <option value="default">Sort</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filteredListings.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >

              <Link href={`/listing/${item._id}`}>
                <div className="h-44 bg-gray-100 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No Image
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-4">

                <h2 className="font-semibold text-lg truncate">
                  {item.title}
                </h2>

                <p className="text-green-600 font-bold mt-2">
                  ₹ {item.price}
                </p>

                <div className="flex gap-2 mt-4">

                  <Link
                    href={`/listing/${item._id}`}
                    className="flex-1 text-center bg-gray-200 py-2 rounded"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Add
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}