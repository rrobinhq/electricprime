import { categories as legacyCategories, products as legacyProducts } from "@/lib/products";
import type { StoreContent } from "./types";

/**
 * Built from the site's original hardcoded catalog. Images keep pointing at
 * the bundled local assets by default (those imports resolve to real URLs
 * at build time) — editing a product in the Studio and setting a new image
 * URL overrides that per-product, nothing needs to change up front.
 */
export const defaultContent: StoreContent = {
  settings: {
    siteName: "Electro Prime",
    tagline: "Machined chassis, silicon-class performance.",
    chatbotEnabled: false,
  },
  categories: legacyCategories.map((c) => ({
    slug: c.slug,
    name: c.name,
    blurb: c.blurb,
    image: c.image,
  })),
  products: legacyProducts.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    compareAt: p.compareAt,
    rating: p.rating,
    reviews: p.reviews,
    image: p.image,
    tagline: p.tagline,
    colors: p.colors,
    storage: p.storage,
    memory: p.memory,
    specs: p.specs,
    featured: p.featured,
  })),
};
