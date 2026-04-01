// src/lib/slugify.ts
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // spaces -> hyphen
    .replace(/[^\w\-]+/g, "")    // remove non-word chars
    .replace(/\-\-+/g, "-");     // collapse
}
