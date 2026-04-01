"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter();

  // 🔥 ADD THIS (fix hydration)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleLogout() {
    localStorage.removeItem("sx_current_user");
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  }

  // 🔥 ADD THIS (prevents mismatch)
  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-green-700">
            ScrapXchange
          </h2>

          <nav className="flex flex-col gap-4 text-gray-700">
            <Link href="/dashboard" className="hover:text-green-600">
              Dashboard
            </Link>
            <Link href="/dashboard/orders" className="hover:text-green-600">
              Orders
            </Link>
            <Link href="/dashboard/listings" className="hover:text-green-600">
              Listings
            </Link>
            <Link href="/dashboard/seller-orders">
              Seller Orders
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}