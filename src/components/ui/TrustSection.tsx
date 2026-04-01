"use client";

import { FaCheckCircle, FaShieldAlt, FaStar, FaCertificate } from "react-icons/fa";

export default function TrustSection() {
  const trustPoints = [
    {
      icon: <FaCheckCircle className="text-4xl text-white" />,
      title: "100% Verified Traders",
      desc: "Every buyer & seller completes strict verification before trading.",
    },
    {
      icon: <FaShieldAlt className="text-4xl text-white" />,
      title: "Secure Transactions",
      desc: "Advanced fraud detection ensures safe online scrap trading.",
    },
    {
      icon: <FaStar className="text-4xl text-white" />,
      title: "Top Rated Platform",
      desc: "Rated highly by thousands of traders for reliability.",
    },
    {
      icon: <FaCertificate className="text-4xl text-white" />,
      title: "Certified Partners",
      desc: "Work with industry-certified scrap buyers and recyclers.",
    },
  ];

  return (
    <section className="bg-[var(--sx-green-700)] text-white py-20">
      <div className="container-custom text-center">
        <h2 className="text-3xl font-bold mb-12">Trusted By Thousands Across India</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {trustPoints.map((item, i) => (
            <div
              key={i}
              className="p-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
            >
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-white/80 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
