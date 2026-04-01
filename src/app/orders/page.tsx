"use client";

import { useEffect, useState } from "react";

interface Order {
  _id: string;
  name: string;
  phone: string;
  address: string;
  pincode: string;
  items: {
    title: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/order");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">My Orders 📦</h1>

        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-5 rounded shadow"
              >

                <div className="flex justify-between mb-3">
                  <span className="font-semibold">
                    Order ID: {order._id.slice(-6)}
                  </span>

                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="mb-3">
                  <p><strong>Name:</strong> {order.name}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                </div>

                <div className="border-t pt-3 mb-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.title} x {item.quantity}
                      </span>
                      <span>₹ {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹ {order.totalAmount}</span>
                </div>

                <div className="mt-3 text-sm">
                  Status:{" "}
                  <span className="text-green-600 font-semibold">
                    {order.orderStatus}
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}