// src/components/ui/Footer.tsx
"use client";

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function CategoryCard() {

  return (
    <footer className="bg-[var(--sx-green-950)] text-white mt-20">
      {/* top gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[var(--sx-teal)] to-[var(--sx-green-700)]" />

      <div className="container-custom max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* COMPANY */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="ScrapXchange Home">
            <div className="w-10 h-10 rounded-lg bg-[var(--sx-green-700)] flex items-center justify-center text-white font-bold">
              SX
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-wide">ScrapXchange</h3>
              <p className="text-xs text-white/80 max-w-[220px]">
                India’s most trusted digital scrap marketplace. Connect verified buyers and sellers across 1000+ cities.
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3 mt-6">
            <a
              href="#"
              aria-label="Facebook"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick links</h4>
          <ul className="space-y-2 text-white/80">
            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/how-it-works" className="hover:text-white transition">How it works</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
            <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            <li><Link href="/sell" className="hover:text-white transition">Sell Scrap</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-white/80">
            <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
            <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
            <li><Link href="/safety" className="hover:text-white transition">Safety Tips</Link></li>
            <li><Link href="/refunds" className="hover:text-white transition">Refund Policy</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Report an issue</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact</h4>
          <div className="text-white/80 text-sm space-y-3">
            <div>
              <strong className="block text-white">Customer support</strong>
              <a href="tel:+911800727247" className="block hover:text-white">+91-1800-SCRAP-24</a>
            </div>

            <div>
              <strong className="block text-white">Email</strong>
              <a href="mailto:support@scrapxchange.pro" className="block hover:text-white">support@scrapxchange.pro</a>
            </div>

            <div>
              <strong className="block text-white">Office</strong>
              <span className="block">Mumbai, India</span>
            </div>

            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-block bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* divider */}
      <div className="w-full border-t border-white/10" />

      {/* bottom bar */}
      <div className="container-custom max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/60 text-sm">
        <div>© {new Date().getFullYear()} ScrapXchange — All Rights Reserved.</div>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/cookies" className="hover:text-white">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
