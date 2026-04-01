// src/components/ui/TopBar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, Twitter, Instagram, Facebook } from "lucide-react";

const TopBar: React.FC = () => {
  return (
    <div className="w-full bg-white border-b text-sm text-gray-700">
      <div className="container-custom max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 py-2">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-6 flex-wrap">
          {/* Phone */}
          <a
            href="tel:+911800727247"
            className="flex items-center gap-2 hover:underline"
            aria-label="Call ScrapXchange support"
            title="Call ScrapXchange support"
          >
            <Phone className="w-4 h-4 text-[var(--sx-green-700)]" />
            <span className="font-medium text-xs sm:text-sm">+91-1800-SCRAP-24</span>
          </a>

          {/* Email */}
          <a
            href="mailto:support@scrapxchange.pro"
            className="flex items-center gap-2 hover:underline"
            aria-label="Email ScrapXchange support"
            title="Email ScrapXchange support"
          >
            <Mail className="w-4 h-4 text-[var(--sx-green-700)]" />
            <span className="font-medium text-xs sm:text-sm">support@scrapxchange.pro</span>
          </a>

          {/* Tags (hide on very small screens) */}
          <span className="text-gray-500 text-xs sm:text-sm hidden sm:inline">100% Verified Traders</span>
          <span className="text-gray-500 text-xs sm:text-sm hidden md:inline">24/7 Support</span>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <span className="font-medium text-xs sm:text-sm hidden sm:inline">Follow us:</span>

          <Link href="#" aria-label="Follow ScrapXchange on Twitter" className="text-gray-600 hover:text-[var(--sx-green-700)]">
            <Twitter className="w-4 h-4" />
          </Link>

          <Link href="#" aria-label="Follow ScrapXchange on Instagram" className="text-gray-600 hover:text-[var(--sx-green-700)]">
            <Instagram className="w-4 h-4" />
          </Link>

          <Link href="#" aria-label="Follow ScrapXchange on Facebook" className="text-gray-600 hover:text-[var(--sx-green-700)]">
            <Facebook className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
