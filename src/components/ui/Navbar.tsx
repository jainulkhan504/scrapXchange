"use client";

import Link from "next/link";
import { ShoppingCart, Bell, Search, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  /* =========================
     LOAD CART + USER (FIXED)
  ========================= */
  useEffect(() => {
    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        const total = cart.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );

        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };

    const loadUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };

    // Initial load
    updateCart();
    loadUser();

    // ✅ Listen for cart updates
    window.addEventListener("cartUpdated", updateCart);

    // ✅ Fix: update when tab becomes active
    window.addEventListener("focus", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("focus", updateCart);
    };
  }, []);

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  /* =========================
     SEARCH
  ========================= */
  const handleSearch = () => {
    if (!search.trim()) return;
    window.location.href = `/marketplace?search=${search}`;
  };

  return (
    <header className="w-full bg-white shadow-md border-b">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-6 py-3 bg-gray-50 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={16} />
          <span>Delhi, India</span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="font-medium">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>

      {/* MAIN NAV */}
      <div className="flex items-center gap-6 px-8 py-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-green-600 text-white px-3 py-2 rounded font-bold">
            SX
          </div>
          <span className="text-xl font-bold">
            ScrapXchange
          </span>
        </Link>

        {/* SEARCH */}
        <div className="flex-1 flex items-center border rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search scrap materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 outline-none"
          />

          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-5 py-2"
          >
            <Search size={18} />
          </button>
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-6">

          {/* 🔔 Notification (placeholder for future) */}
          <button className="relative">
            <Bell size={22} />
          </button>

          {/* 🛒 Cart */}
          <Link href="/cart" className="relative">
            <ShoppingCart size={22} />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </div>

      {/* CATEGORY BAR */}
      <div className="border-t px-8 py-3 flex gap-6 text-sm overflow-x-auto">
        {[
          "All",
          "Metal",
          "Plastic",
          "Paper",
          "Electronics",
          "Industrial",
        ].map((cat) => (
          <Link
            key={cat}
            href={`/marketplace?category=${cat}`}
            className="hover:text-green-600 whitespace-nowrap"
          >
            {cat}
          </Link>
        ))}
      </div>

    </header>
  );
}