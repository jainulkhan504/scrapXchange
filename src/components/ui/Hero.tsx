"use client";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-[var(--sx-green-700)] to-[var(--sx-teal)] text-white pt-32 pb-24">
      <div className="container mx-auto px-4 text-center">
        
        {/* MAIN HEADING */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
          Transform Your Scrap Trading
          <br />
          Experience
        </h1>

        {/* SUBTEXT */}
        <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-10 font-medium">
          India’s #1 Professional Scrap Trading Platform — connect verified buyers & sellers across 1000+ cities.
        </p>

        {/* BUTTONS */}
        <div className="flex justify-center gap-6 mt-4">
          <button className="bg-white text-[var(--sx-green-700)] px-10 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-gray-100 transition">
            Start Selling
          </button>

          <button className="bg-[var(--sx-accent)] text-black px-10 py-4 rounded-full text-lg font-semibold shadow-md hover:opacity-90 transition">
            Start Buying
          </button>
        </div>

      </div>
    </section>
  );
}
