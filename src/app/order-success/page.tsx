"use client";

import { useRouter } from "next/navigation";

export default function OrderSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">

        {/* ICON */}
        <div className="text-5xl mb-4">✅</div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          Order Placed Successfully!
        </h1>

        {/* SUBTEXT */}
        <p className="text-gray-600 mb-6">
          Thank you for your order. Our team will contact you soon.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3">

          <button
            onClick={() => router.push("/orders")}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            View Orders
          </button>

          <button
            onClick={() => router.push("/marketplace")}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Continue Shopping
          </button>

        </div>

      </div>
    </div>
  );
}