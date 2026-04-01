"use client";

export default function OrdersPage() {
  const orders = [
    { id: 1, item: "Aluminium Scrap", status: "Completed", amount: "₹12,000" },
    { id: 2, item: "Copper Wire", status: "Pending", amount: "₹8,500" },
    { id: 3, item: "Plastic Scrap", status: "Processing", amount: "₹4,200" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Orders 📦</h1>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Item</th>
              <th className="p-4">Status</th>
              <th className="p-4">Amount</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-4">#{order.id}</td>
                <td className="p-4">{order.item}</td>
                <td className="p-4">{order.status}</td>
                <td className="p-4">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}