"use client";

import { useEffect, useState, useRef } from "react";

interface Listing {
  _id: string;
  title: string;
  price: number;
  unit?: string;
  image?: string;
  status: string;
}

const scrapSuggestions = [
  "Metal","Copper","Aluminum","Iron","Steel","Plastic","Paper",
  "Cardboard","Glass","E-waste","Laptop scrap","Mobile scrap",
  "Battery scrap","Cable wire","Copper wire","Brass","Rubber",
  "Wood scrap","Industrial scrap",
];

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [image, setImage] = useState("");

  const [toast, setToast] = useState("");

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const res = await fetch("/api/listings");
    const data = await res.json();

    if (Array.isArray(data)) setListings(data);
    else if (data.data) setListings(data.data);
  };

  /* =========================
     SUGGESTION LOGIC
  ========================= */
  const handleTitleChange = (value: string) => {
    setTitle(value);

    if (!value) {
      setShowSuggestions(false);
      return;
    }

    const filtered = scrapSuggestions.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  const selectSuggestion = (value: string) => {
    setTitle(value);
    setShowSuggestions(false);
  };

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = (listing: Listing) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((item: any) => item._id === listing._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        _id: listing._id,
        title: listing.title,
        price: listing.price,
        unit: listing.unit,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    setToast(`🛒 ${listing.title} added to cart`);
    setTimeout(() => setToast(""), 2000);
  };

  /* =========================
     CREATE / UPDATE (FIXED)
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ VALIDATION
    if (!title.trim()) {
      setToast("❌ Please enter product name");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    if (!price || isNaN(Number(price))) {
      setToast("❌ Please enter valid price");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    if (!unit) {
      setToast("❌ Please select unit");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    const url = editingId
      ? `/api/listings/${editingId}`
      : "/api/listings";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ IMPORTANT
      body: JSON.stringify({
        title,
        price: Number(price),
        unit: String(unit), // ✅ FIXED
        image,
        status: "Active",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setToast(data.message || "Error");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    setToast(editingId ? "Updated successfully ✅" : "Added successfully ✅");
    setTimeout(() => setToast(""), 2000);

    setTitle("");
    setPrice("");
    setUnit("kg");
    setImage("");
    setEditingId(null);

    fetchListings();
  };

  /* =========================
     EDIT
  ========================= */
  const handleEdit = (item: Listing) => {
    setEditingId(item._id);
    setTitle(item.title);
    setPrice(String(item.price));
    setUnit(item.unit || "kg");
    setImage(item.image || "");

    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete listing?")) return;

    const res = await fetch(`/api/listings/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      setToast(data.message);
      setTimeout(() => setToast(""), 2000);
      return;
    }

    setToast("Deleted successfully 🗑");
    setTimeout(() => setToast(""), 2000);

    fetchListings();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Manage Listings 🏷️
        </h1>

        {/* FORM */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-lg shadow mb-8 flex flex-wrap gap-3 relative"
        >
          <div className="relative flex-1">
            <input
              placeholder="Product title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="border p-2 rounded w-full"
            />

            {showSuggestions && (
              <div className="absolute bg-white border w-full mt-1 rounded shadow z-10 max-h-40 overflow-y-auto">
                {filteredSuggestions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => selectSuggestion(item)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded w-32"
          />

          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="kg">kg</option>
            <option value="ton">ton</option>
            <option value="piece">piece</option>
            <option value="quintal">quintal</option>
          </select>

          <input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="border p-2 rounded flex-1"
          />

          <button className="bg-green-600 text-white px-5 rounded hover:bg-green-700">
            {editingId ? "Update" : "Add"}
          </button>
        </form>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>

              <div className="p-4">
                <h2 className="font-semibold text-lg truncate">
                  {item.title}
                </h2>

                <p className="text-green-600 font-bold text-xl">
                  ₹ {item.price}/{item.unit || "kg"}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-blue-500 text-white py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 bg-red-500 text-white py-1 rounded"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 bg-yellow-500 text-white py-1 rounded"
                  >
                    Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TOAST */}
        {toast && (
          <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
            {toast}
          </div>
        )}

      </div>
    </div>
  );
}