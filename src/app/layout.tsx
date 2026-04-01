import "./globals.css";
import type { Metadata } from "next";
import TopBar from "@/components/ui/TopBar";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "ScrapXchange | Online Scrap Marketplace",
  description:
    "Buy and Sell Scrap Materials - Secure, Verified, and Easy to Use",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-poppins bg-gray-50">
        <TopBar />
        <Navbar />
        {children}
      </body>
    </html>
  );
}