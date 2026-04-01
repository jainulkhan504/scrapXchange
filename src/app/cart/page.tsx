"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  _id: string;
  title: string;
  price: number;
  unit?: string;
  quantity: number;
  image?: string; // ✅ NEW
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadCart();

    const handleUpdate = () => {
      loadCart();
    };

    window.addEventListener("cartUpdated", handleUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleUpdate);
    };
  }, []);

  const loadCart = () => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  };

  const updateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQty = (id: string) => {
    const updated = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id: string) => {
    const updated = cart.map((item) =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = cart.filter((item) => item._id !== id);
    updateCart(updated);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">Your Cart 🛒</h1>

        {cart.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
            Your cart is empty
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {/* LEFT SIDE */}
            <div className="md:col-span-2 space-y-4">

              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-xl shadow flex gap-4 items-center"
                >

                  {/* IMAGE */}
                  {item.image ? (
                    <img
                      src={item.image}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                      No Image
                    </div>
                  )}

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">
                      {item.title}
                    </h2>

                    <p className="text-green-600 font-bold">
                      ₹ {item.price}/{item.unit || "kg"}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-2 mt-2">

                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increaseQty(item._id)}
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>

                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>

                  {/* PRICE */}
                  <div className="text-right font-bold">
                    ₹ {(item.price * item.quantity).toFixed(2)}
                  </div>

                </div>
              ))}

            </div>

            {/* RIGHT SIDE */}
            <div className="bg-white p-6 rounded-xl shadow h-fit">

              <h2 className="text-xl font-bold mb-4">
                Order Summary
              </h2>

              <div className="flex justify-between mb-2">
                <span>Total Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>Total Price</span>
                <span className="font-bold">
                  ₹ {total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                Proceed to Checkout →
              </button>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}