// src/components/ui/CategoryCard.tsx
"use client";

import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  image: string;
  items?: number;
  href?: string;
};

export default function CategoryCard({ title, description, image, items, href = "#" }: Props) {
  return (
    <Link href={href} className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition">
      <div className="h-40 w-full bg-gray-100 overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>

      <div className="p-4 bg-white">
        <h3 className="font-semibold text-lg">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        {typeof items !== "undefined" && (
          <p className="text-xs text-gray-500 mt-2">{items.toLocaleString()} listings</p>
        )}
      </div>
    </Link>
  );
}
