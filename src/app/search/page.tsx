// src/app/search/page.tsx
import { useSearchParams } from "next/navigation";

export default function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // In Next App Router you can accept { searchParams } server-side
  const q = (searchParams?.q as string) ?? "";
  const location = (searchParams?.location as string) ?? "";

  // TODO: fetch your API with q & location
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Search results</h1>
      <p className="text-sm text-gray-600">Query: {q} • Location: {location}</p>

      {/* show results (map over data from API) */}
    </div>
  );
}
