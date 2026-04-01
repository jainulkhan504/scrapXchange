// src/components/ui/CategoryBar.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CategoryTree from "./CategoryTree";
import { slugify } from "@/lib/slugify";

/**
 * Example categories structure. Replace / extend from your DB/api.
 * Each node can have children array for deeper tree.
 */
const CATEGORIES = [
  {
    id: "metal",
    title: "Metal Scrap",
    children: [
      { id: "ferrous", title: "Ferrous Metals" },
      { id: "non-ferrous", title: "Non-Ferrous Metals" },
      { id: "copper", title: "Copper Scrap" },
      { id: "aluminum", title: "Aluminium" },
    ],
  },
  { id: "electronics", title: "Electronics" },
  { id: "paper", title: "Paper & Cardboard" },
  { id: "plastic", title: "Plastic Materials" },
  { id: "industrial", title: "Industrial Equipment" },
  { id: "b2b", title: "B2B Trading" },
];

export default function CategoryBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All India"); // default
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function onSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    // Build query params: q=...&location=...
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location && location !== "All India") params.set("location", location);
    // navigate to a search results page you implement at /search
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div ref={containerRef} className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* All categories button */}
        <div className="relative">
          <button
            onClick={() => setOpen((s) => !s)}
            className="flex items-center gap-2 px-3 py-2 rounded-md border bg-white hover:shadow"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline">All Categories</span>
          </button>

          {open && (
            <div className="absolute left-0 mt-2 w-[28rem] bg-white border rounded-lg shadow-lg z-40 p-4">
              <h4 className="font-semibold mb-2">Categories</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  {/* Left - main list */}
                  <CategoryTree nodes={CATEGORIES as any} />
                </div>

                <div className="pl-4 border-l">
                  <h5 className="text-sm text-gray-600">Popular</h5>
                  <ul className="mt-2 space-y-2">
                    {CATEGORIES.slice(0, 6).map((c) => (
                      <li key={c.id}>
                        <Link href={`/category/${slugify(c.title)}`} className="text-sm hover:text-emerald-600">
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main category quick links (visible across nav) */}
        <nav className="hidden md:flex items-center gap-6 flex-1">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/category/${slugify(c.title)}`}
              className="text-sm hover:text-emerald-600"
            >
              {c.title}
            </Link>
          ))}
        </nav>

        {/* Search + location */}
        <form onSubmit={onSearch} className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-2 border rounded overflow-hidden">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search scrap, city, buyer..."
              className="px-3 py-2 w-64 focus:outline-none"
              aria-label="Search listings"
            />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-2 py-2 border-l"
              aria-label="Location"
            >
              <option>All India</option>
              <option>Delhi, India</option>
              <option>Mumbai, India</option>
              <option>Bengaluru, India</option>
              <option>Hyderabad, India</option>
            </select>

            <button type="submit" className="px-3 bg-emerald-600 text-white">
              Search
            </button>
          </div>

          {/* quick action buttons */}
          <Link href="/sell" className="px-4 py-2 border rounded text-sm hidden sm:inline-block">
            Change Location
          </Link>
        </form>
      </div>

      {/* optional gradient bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
    </div>
  );
}
