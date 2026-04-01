"use client";

import { useEffect, useState } from "react";

interface Listing {
  _id: string;
  title: string;
  price: number;
  unit?: string;
  image?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD USER + DATA
  ========================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const raw = localStorage.getItem("sx_current_user");
        if (raw) {
          setUser(JSON.parse(raw));
        }

        const [listRes, orderRes] = await Promise.all([
          fetch("/api/listings"),
          fetch("/api/order"),
        ]);

        const listData = await listRes.json();
        const orderData = await orderRes.json();

        setListings(listData || []);
        setOrders(orderData || []);
      } catch (err) {
        console.log("Failed loading data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

      setListings((prev) => prev.filter((item) => item._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  /* =========================
     EDIT LISTING
  ========================= */
  const handleEdit = (item: Listing) => {
    const title = prompt("Enter new title", item.title);
    const price = prompt("Enter new price", String(item.price));

    if (!title || !price || isNaN(Number(price))) {
      alert("Invalid input");
      return;
    }

    fetch(`/api/listings/${item._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        price: Number(price),
        unit: item.unit,
        image: item.image,
      }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setListings((prev) =>
          prev.map((l) => (l._id === item._id ? updated : l))
        );
      })
      .catch(() => alert("Update failed"));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      <h1 className="text-3xl font-bold mb-8">
        Welcome {user?.name || user?.email} 👋
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white shadow rounded-2xl p-6 text-center">
          <h2 className="text-gray-600">Your Listings</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {listings.length}
          </p>
        </div>

        <div className="bg-white shadow rounded-2xl p-6 text-center">
          <h2 className="text-gray-600">Orders</h2>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {orders.length}
          </p>
        </div>

        <div className="bg-white shadow rounded-2xl p-6 text-center">
          <h2 className="text-gray-600">Status</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">
            Active
          </p>
        </div>

      </div>

      {/* LISTINGS */}
      <h2 className="text-2xl font-semibold mb-6">
        Your Listings 📦
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No listings yet 😔 <br />
          Start selling your scrap!
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {item.image && (
                <img
                  src={item.image}
                  className="w-full h-40 object-cover"
                />
              )}

              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">
                  {item.title}
                </h3>

                <p className="text-green-600 font-bold mt-1">
                  ₹ {item.price}/{item.unit || "kg"}
                </p>

                <div className="flex gap-2 mt-4">

                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    🗑 Delete
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}