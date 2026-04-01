// src/components/ui/CategoryGrid.tsx
"use client";

import CategoryCard from "./CategoryCard";

type Cat = {
  title: string;
  description?: string;
  image: string;
  items?: number;
  href?: string;
};

const categories: Cat[] = [
  {
    title: "Metal Scrap",
    description: "Ferrous & non-ferrous metal scrap",
    image: "/images/categories/metal.png",
    items: 1240,
  },
  {
    title: "Electronics",
    description: "E-waste and electronics components",
    image: "/images/categories/electronics.png",
    items: 860,
  },
  {
    title: "Plastic Materials",
    description: "Plastic pellets, bottles, films",
    image: "/images/categories/plastic.png",
    items: 430,
  },
  // add more...
];

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // spaces to hyphens
    .replace(/[^\w\-]+/g, "")    // remove non-word chars
    .replace(/\-\-+/g, "-");     // collapse multiple hyphens
}

export default function CategoryGrid() {
  return (
    <section className="container-custom py-12">
      <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((c) => {
          const href = `/category/${slugify(c.title)}`;
          return (
            <CategoryCard
              key={c.title}
              title={c.title}
              description={c.description}
              image={c.image}
              items={c.items}
              href={href}
            />
          );
        })}
      </div>
    </section>
  );
}
