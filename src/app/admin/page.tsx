"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/order").then(res => res.json()).then(setOrders);
    fetch("/api/listings").then(res => res.json()).then(setListings);
  }, []);

  const revenue = orders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  const chartData = orders.map((o, i) => ({
    name: i + 1,
    value: o.totalAmount || 0,
  }));

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] text-white p-6">
        <h1 className="text-xl font-bold mb-8">
          ScrapXchange
        </h1>

        <nav className="space-y-4 text-sm">
          <p className="text-blue-400 font-semibold">Dashboard</p>
          <p className="hover:text-blue-300 cursor-pointer">Live Prices</p>
          <p className="hover:text-blue-300 cursor-pointer">Inventory</p>
          <p className="hover:text-blue-300 cursor-pointer">Orders</p>
          <p className="hover:text-blue-300 cursor-pointer">Users</p>
          <p className="hover:text-blue-300 cursor-pointer">Reports</p>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1">

        {/* TOP BAR */}
        <div className="flex justify-between items-center bg-white px-6 py-4 shadow">
          <input
            placeholder="Search..."
            className="border px-4 py-2 rounded w-1/3"
          />

          <div className="flex items-center gap-4">
            <span>🔔</span>
            <span className="font-semibold">Admin</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">

          {/* ✅ UPDATED MARKET OVERVIEW */}
          <div className="bg-white p-6 rounded shadow">

            <h2 className="text-lg font-bold mb-4">
              Market Overview
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {/* LEFT GRAPH */}
              <div className="col-span-2">

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Live Copper</p>
                  <h2 className="text-xl font-bold">₹854/kg</h2>
                </div>

                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                    />
                  </LineChart>
                </ResponsiveContainer>

              </div>

              {/* RIGHT CARDS */}
              <div className="grid grid-cols-2 gap-4">
                <PriceCard name="Aluminum" price="₹210/kg" />
                <PriceCard name="Steel" price="₹65/kg" />
                <PriceCard name="Brass" price="₹630/kg" />
                <PriceCard name="Copper" price="₹854/kg" />
              </div>

            </div>
          </div>

          {/* QUICK STATS */}
          <div className="grid md:grid-cols-4 gap-4">
            <Box title="Today's Orders" value={orders.length} />
            <Box title="Total Listings" value={listings.length} />
            <Box title="Total Revenue" value={`₹${revenue}`} />
            <Box title="Active Users" value={new Set(orders.map(o => o.userEmail)).size} />
          </div>

          {/* TABLE */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-bold mb-4">Order Processing</h2>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o._id} className="border-b">
                    <td>#{o._id.slice(0, 6)}</td>
                    <td>₹{o.totalAmount}</td>
                    <td
                      className={
                        o.orderStatus === "Delivered"
                          ? "text-green-600"
                          : o.orderStatus === "Pending"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }
                    >
                      {o.orderStatus || "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function Box({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}

function PriceCard({ name, price }: any) {
  return (
    <div className="bg-gray-50 p-3 rounded shadow-sm">
      <p className="text-sm text-gray-500">{name}</p>
      <h2 className="font-bold">{price}</h2>
      <div className="h-10 mt-2 bg-gradient-to-r from-green-200 to-green-400 rounded"></div>
    </div>
  );
}