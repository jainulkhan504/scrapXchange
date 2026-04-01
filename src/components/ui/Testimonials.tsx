"use client";

import { FaStar } from "react-icons/fa";

export default function Testimonials() {
  const reviews = [
    {
      name: "Rahul Verma",
      role: "Industrial Scrap Seller",
      review:
        "ScrapXchange helped me find genuine buyers at the best price. The verification system ensures zero fraud. Highly recommended!",
      rating: 5,
      image: "/images/user1.png",
    },
    {
      name: "Priya Sharma",
      role: "Recycling Business Owner",
      review:
        "Amazing platform! I regularly buy plastic and metal scrap through ScrapXchange. Very secure and fast transactions.",
      rating: 5,
      image: "/images/user2.png",
    },
    {
      name: "Amit Patel",
      role: "Bulk E-Waste Buyer",
      review:
        "The app is simple to use. I get 100% verified sellers and excellent customer support every time.",
      rating: 5,
      image: "/images/user3.png",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom text-center">
        <h2 className="text-3xl font-bold mb-4">What People Are Saying</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-12">
          Hear from our trusted community of buyers and sellers across India.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl shadow-md border hover:shadow-xl transition bg-gray-50"
            >
              {/* Profile Image */}
              <div className="w-20 h-20 mx-auto mb-4">
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              {/* Name & Role */}
              <h3 className="text-lg font-semibold">{r.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{r.role}</p>

              {/* Review */}
              <p className="text-gray-700 text-sm mb-4">“{r.review}”</p>

              {/* Stars */}
              <div className="flex justify-center gap-1">
                {[...Array(r.rating)].map((_, idx) => (
                  <FaStar key={idx} className="text-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
