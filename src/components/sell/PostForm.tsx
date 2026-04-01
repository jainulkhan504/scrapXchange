// src/components/sell/PostForm.tsx
"use client";

import React, { useState } from "react";
import ImageDropzone from "./ImageDropzone";

export default function PostForm() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    weight: "",
    price: "",
    unit: "kg",
    location: "",
    description: "",
    images: [] as File[],
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function setField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "images") fd.append(key, value as string);
    });

    form.images.forEach((img) => fd.append("images", img));

    // TODO: replace with your API
    console.log("Form submitted:", form);

    setLoading(false);
    setSuccessMsg("Listing posted successfully!");
  }

  return (
    <form onSubmit={submit} className="bg-white p-6 shadow rounded-xl space-y-6">
      <h2 className="text-xl font-semibold">Post Scrap</h2>

      {successMsg && <p className="text-green-700">{successMsg}</p>}

      <input
        required
        value={form.title}
        onChange={(e) => setField("title", e.target.value)}
        className="p-2 border rounded w-full"
        placeholder="Scrap Title"
      />

      <select
        required
        value={form.category}
        onChange={(e) => setField("category", e.target.value)}
        className="p-2 border rounded w-full"
      >
        <option value="">Select Category</option>
        <option value="metal">Metal Scrap</option>
        <option value="electronics">Electronics</option>
        <option value="plastic">Plastic</option>
        <option value="paper">Paper & Cardboard</option>
      </select>

      <div className="grid grid-cols-2 gap-3">
        <input
          required
          value={form.weight}
          onChange={(e) => setField("weight", e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="Weight"
        />
        <input
          required
          value={form.price}
          onChange={(e) => setField("price", e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="Price"
        />
      </div>

      <input
        required
        value={form.location}
        onChange={(e) => setField("location", e.target.value)}
        className="p-2 border rounded w-full"
        placeholder="Location"
      />

      <textarea
        required
        value={form.description}
        onChange={(e) => setField("description", e.target.value)}
        className="p-2 border rounded w-full min-h-[120px]"
        placeholder="Description"
      />

      <ImageDropzone
        onFilesChangeAction={(files) => setField("images", files)} // fixed name
      />

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-emerald-600 text-white disabled:bg-gray-400"
      >
        {loading ? "Posting..." : "Post Listing"}
      </button>
    </form>
  );
}
