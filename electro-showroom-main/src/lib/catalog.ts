import type { CategorySlug, Product } from "@/data/types";

export const getProduct = (products: Product[], id: string) =>
  products.find((p) => p.id === id);

export const byCategory = (products: Product[], slug: CategorySlug) =>
  products.filter((p) => p.category === slug);

export const searchProducts = (products: Product[], q: string) => {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const terms = query.split(/\s+/);
  return products
    .map((p) => {
      const haystack = [
        p.name,
        p.brand,
        p.category,
        p.tagline,
        ...(p.storage ?? []),
        ...(p.memory ?? []),
        ...Object.values(p.specs),
      ]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce((acc, t) => acc + (haystack.includes(t) ? 1 : 0), 0);
      return { p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((r) => r.p);
};
