"use client";

import { FaUpload, FaUserCheck, FaHandshake, FaTruck } from "react-icons/fa";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FaUpload className="text-4xl text-[var(--sx-green-700)]" />,
      title: "Post Your Scrap",
      desc: "Upload details, photos & category of your scrap material.",
    },
    {
      icon: <FaUserCheck className="text-4xl text-[var(--sx-green-700)]" />,
      title: "Get Verified Buyers",
      desc: "Receive offers only from verified and trusted buyers.",
    },
    {
      icon: <FaHandshake className="text-4xl text-[var(--sx-green-700)]" />,
      title: "Negotiate & Finalize",
      desc: "Chat, negotiate pricing and finalize the best offer.",
    },
    {
      icon: <FaTruck className="text-4xl text-[var(--sx-green-700)]" />,
      title: "Fast & Secure Pickup",
      desc: "Buyer picks up the scrap and payment is processed securely.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom text-center">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          A simple and secure process to help you sell scrap effortlessly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white p-8 shadow-md rounded-xl border hover:shadow-lg transition"
            >
              <div className="mb-4 flex justify-center">{step.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
              <div className="mt-4 text-sm font-bold text-[var(--sx-green-700)]">
                Step {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
