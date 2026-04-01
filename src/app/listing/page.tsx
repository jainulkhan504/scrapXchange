"use client";

import { useEffect, useState } from "react";

interface Listing {
  _id: string;
  title: string;
  price: number;
  unit?: string;
  image?: string;
}

export default function ListingPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD LISTINGS
  ========================= */
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listings");
        const data = await res.json();
        setListings(data);
      } catch {
        console.log("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  /* =========================
     IMAGE UPLOAD (CLOUDINARY)
  ========================= */
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dgwgxijim/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setImage(data.secure_url);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     ADD LISTING
  ========================= */
  const handleAdd = async () => {
    if (!title || !price) {
      alert("Title and price required");
      return;
    }

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          price,
          unit,
          image,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      setListings((prev) => [data, ...prev]);

      // reset
      setTitle("");
      setPrice("");
      setImage("");

    } catch {
      alert("Failed to add listing");
    }
  };

  /* =========================
     DELETE LISTING
  ========================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;

    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">

      <h1 className="text-3xl font-bold mb-6">
        Manage Listings 🏷️
      </h1>

      {/* ADD FORM */}
      <div className="bg-white p-4 rounded-xl shadow mb-8 flex flex-wrap gap-3 items-center">

        <input
          placeholder="Product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        <input
          placeholder="Price"
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
        </select>

        {/* IMAGE UPLOAD */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {uploading && (
            <p className="text-sm text-gray-500">Uploading...</p>
          )}
        </div>

        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>

      </div>

      {/* LISTINGS */}
      {loading ? (
        <p>Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No listings yet 😔
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              {item.image ? (
                <img
                  src={item.image}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold">{item.title}</h3>

                <p className="text-green-600 font-bold">
                  ₹ {item.price}/{item.unit || "kg"}
                </p>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="mt-3 w-full bg-red-500 text-white py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}