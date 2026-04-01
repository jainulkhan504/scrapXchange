"use client";

export default function Newsletter() {
  return (
    <section className="bg-[var(--sx-green-50)] py-20">
      <div className="container-custom text-center">
        
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-[var(--sx-green-800)] mb-4">
          Stay Updated With Scrap Price Alerts
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join 50,000+ traders and get instant updates on the latest scrap prices,
          new buyers, and exclusive deals every week.
        </p>

        {/* Newsletter Form */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-5 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-[var(--sx-green-700)] outline-none text-gray-700"
          />

          <button className="bg-[var(--sx-green-700)] text-white px-8 py-3 rounded-full font-semibold hover:bg-[var(--sx-green-800)] transition">
            Subscribe
          </button>
        </div>

        {/* Guarantee */}
        <p className="text-xs text-gray-500 mt-4">
          ✔ No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
