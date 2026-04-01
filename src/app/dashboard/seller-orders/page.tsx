"use client";

import { useEffect, useState } from "react";

export default function SellerOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/seller-orders");
    const data = await res.json();
    setOrders(data);
  };

  /* =========================
     UPDATE STATUS (NO RELOAD)
  ========================= */
  const updateStatus = async (id: string, status: string) => {
    setLoadingId(id);

    const res = await fetch("/api/order/update-status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, status }),
    });

    if (res.ok) {
      // ✅ UPDATE UI INSTANTLY
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? { ...order, orderStatus: status }
            : order
        )
      );

      setToast(`✅ Status updated to ${status}`);
      setTimeout(() => setToast(""), 2000);
    } else {
      setToast("❌ Failed to update");
      setTimeout(() => setToast(""), 2000);
    }

    setLoadingId(null);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">
        Seller Orders 📦
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet</p>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-xl shadow"
            >
              {/* HEADER */}
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-semibold">
                    Order ID: {order._id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-green-600 font-bold text-lg">
                  ₹ {order.totalAmount}
                </div>
              </div>

              {/* STATUS */}
              <p className="mb-4">
                Status:{" "}
                <span className="font-bold text-blue-600">
                  {order.orderStatus}
                </span>
              </p>

              {/* BUTTONS */}
              <div className="flex gap-2 flex-wrap">

                {["Processing", "Shipped", "Delivered"].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(order._id, status)}
                    disabled={loadingId === order._id}
                    className={`px-4 py-2 rounded text-white
                      ${
                        order.orderStatus === status
                          ? "bg-green-600"
                          : "bg-gray-400 hover:bg-gray-500"
                      }`}
                  >
                    {loadingId === order._id
                      ? "Updating..."
                      : status}
                  </button>
                ))}

              </div>

            </div>
          ))}

        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}