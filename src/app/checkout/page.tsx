"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  _id: string;
  title: string;
  price: number;
  unit?: string;
  quantity: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* =========================
     VALIDATION
  ========================= */
  const validateForm = () => {
    if (!cart.length) {
      alert("Cart is empty");
      return false;
    }

    if (!/^[A-Za-z ]+$/.test(name)) {
      alert("Name should contain only letters");
      return false;
    }

    if (!/^[789][0-9]{9}$/.test(phone)) {
      alert("Enter valid 10-digit phone starting with 7,8,9");
      return false;
    }

    if (address.length < 10) {
      alert("Address too short");
      return false;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      alert("Enter valid 6-digit pincode");
      return false;
    }

    return true;
  };

  /* =========================
     PLACE ORDER
  ========================= */
  const placeOrder = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          address,
          pincode,
          items: cart,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }

      // ✅ CLEAR CART
      localStorage.removeItem("cart");

      // ✅ 🔥 IMPORTANT FIX (real-time update)
      window.dispatchEvent(new Event("cartUpdated"));

      // ✅ REDIRECT
      router.push("/order-success");

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     HANDLE PAYMENT
  ========================= */
  const handlePayment = async () => {
    if (!validateForm()) return;
    await placeOrder();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

        {/* FORM */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Delivery Details</h2>

          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />

          <input
            placeholder="Phone (10 digits)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />

          <textarea
            placeholder="Full Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />

          <input
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />

          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Processing..." : "Pay & Place Order 💳"}
          </button>
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex justify-between mb-2">
                <span>
                  {item.title} x {item.quantity}
                </span>
                <span>₹ {item.price * item.quantity}</span>
              </div>
            ))
          )}

          <hr className="my-3" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹ {total}</span>
          </div>
        </div>

      </div>
    </div>
  );
}