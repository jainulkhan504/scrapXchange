"use client";

import Hero from "@/components/ui/Hero";
import CategoryGrid from "@/components/ui/CategoryGrid";
import WhyChoose from "@/components/ui/WhyChoose";
import TrustSection from "@/components/ui/TrustSection";
import HowItWorks from "@/components/ui/HowItWorks";
import Testimonials from "@/components/ui/Testimonials";
import Newsletter from "@/components/ui/Newsletter";
import Footer from "@/components/ui/Footer";

export default function HomePage() {
  return (
    <div className="bg-[var(--sx-slate-50)] text-[var(--sx-foreground)] min-h-screen">

      {/* Hero */}
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">

        <section className="py-10">
          <CategoryGrid />
        </section>

        <section className="py-8">
          <WhyChoose />
        </section>

        <section className="py-8">
          <TrustSection />
        </section>

        <section className="py-8">
          <HowItWorks />
        </section>

        <section className="py-8">
          <Testimonials />
        </section>

        <section className="py-8">
          <Newsletter />
        </section>

      </main>

      <Footer />
    </div>
  );
}