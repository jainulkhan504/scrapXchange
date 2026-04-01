// app/category/[slug]/page.tsx

import Link from "next/link";

const dummyListings = [
  {
    id: 1,
    title: "Heavy Iron Scrap 5 Tons",
    price: "₹32/kg",
    location: "Mumbai",
    image: "/images/metal.jpg",
  },
  {
    id: 2,
    title: "Copper Wire Scrap",
    price: "₹510/kg",
    location: "Delhi",
    image: "/images/copper.jpg",
  },
  {
    id: 3,
    title: "Mixed Steel Scrap",
    price: "₹42/kg",
    location: "Hyderabad",
    image: "/images/steel.jpg",
  },

  {
    id: 4,
    title: "Mixed Aluminium Scrap",
    price: "₹42/kg",
    location: "Hyderabad",
    image: "/images/Aluminium.png",
  },
];

export default function CategoryListings({ params }: any) {
  const slug = params?.slug ?? "";

  // Convert slug "metal-scrap" → "Metal Scrap"
  const categoryName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char: string) => char.toUpperCase());

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{categoryName} Scrap Listings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dummyListings.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.id}`}
            className="rounded-xl shadow hover:shadow-lg transition overflow-hidden bg-white"
          >
            <img
              src={item.image}
              className="h-48 w-full object-cover"
              alt={item.title}
            />

            <div className="p-4">
              <h2 className="font-semibold text-lg">{item.title}</h2>
              <p className="text-green-600 font-bold">{item.price}</p>
              <p className="text-gray-600 text-sm">{item.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
