"use client";

import { FaShieldAlt, FaBolt, FaUsers, FaHandshake } from "react-icons/fa";

export default function WhyChoose() {
  const items = [
    {
      icon: <FaShieldAlt className="text-3xl text-green-700" />,
      title: "Secure & Verified",
      desc: "All traders on ScrapXchange are fully verified to ensure trusted transactions.",
    },
    {
      icon: <FaBolt className="text-3xl text-green-700" />,
      title: "Fast Transactions",
      desc: "Get the best offers quickly with real-time responses from buyers & sellers.",
    },
    {
      icon: <FaUsers className="text-3xl text-green-700" />,
      title: "Large User Network",
      desc: "Join a rapidly growing community of 80K+ active buyers & sellers.",
    },
    {
      icon: <FaHandshake className="text-3xl text-green-700" />,
      title: "Professional Trading",
      desc: "Smart matchmaking ensures smooth and profitable trading every day.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20 border-t">
      <div className="container-custom text-center">
        <h2 className="text-3xl font-bold mb-12">Why Choose ScrapXchange?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {items.map((box, i) => (
            <div 
              key={i} 
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border"
            >
              <div className="mb-4 flex justify-center">{box.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{box.title}</h3>
              <p className="text-gray-600 text-sm">{box.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
