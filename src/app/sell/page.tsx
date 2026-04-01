"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellPage() {

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Metal");
  const [location, setLocation] = useState("");
  const [stock, setStock] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  /* IMAGE UPLOAD */
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

  /* SUBMIT */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!title || !price) {
      alert("Title & Price required");
      return;
    }

    if (isNaN(Number(price))) {
      alert("Price must be a number");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          price: Number(price),
          unit,
          image,
          description,
          category,
          location,
          stock: Number(stock),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed");
      }

      alert("Listing created successfully 🎉");

      // reset
      setTitle("");
      setPrice("");
      setImage("");
      setDescription("");
      setLocation("");
      setStock("");

      // redirect
      router.push("/marketplace");

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Sell Scrap ♻️
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow space-y-6"
      >

        {/* TITLE */}
        <input
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-3 rounded"
        />

        {/* PRICE + UNIT */}
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-3 rounded"
          />

          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="kg">Per Kg</option>
            <option value="ton">Per Ton</option>
            <option value="piece">Per Piece</option>
          </select>
        </div>

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option>Metal</option>
          <option>Plastic</option>
          <option>Paper</option>
          <option>Electronics</option>
          <option>Industrial</option>
        </select>

        {/* DESCRIPTION */}
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded"
        />

        {/* LOCATION + STOCK */}
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border p-3 rounded"
          />
        </div>

        {/* IMAGE */}
        <input type="file" onChange={handleImageUpload} />

        {uploading && <p>Uploading...</p>}

        {image && (
          <img src={image} className="w-40 rounded" />
        )}

        {/* BUTTON */}
        <button
          disabled={loading || uploading}
          className={`w-full py-3 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>

      </form>

    </div>
  );
}