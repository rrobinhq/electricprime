/**
 * Editable content shape for the store, mirroring the pattern used on the
 * portfolio site: one JSON-ish object, persisted to Redis, edited via a
 * password-gated Studio, with images referenced by URL so they can be
 * swapped without a redeploy.
 */

export type CategorySlug =
  | "laptops"
  | "phones"
  | "tablets"
  | "computers"
  | "monitors"
  | "accessories"
  | "gaming"
  | "audio";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number;
  compareAt?: number | undefined;
  rating: number;
  reviews: number;
  /** Direct image URL (e.g. https://i.ibb.co/..., or /assets/... for a bundled default). */
  image: string;
  tagline: string;
  colors: ProductColor[];
  storage?: string[] | undefined;
  memory?: string[] | undefined;
  specs: Record<string, string>;
  featured?: boolean | undefined;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
  /** Direct image URL. */
  image: string;
}

export interface StoreSettings {
  siteName: string;
  tagline: string;
  chatbotEnabled: boolean;
}

export interface StoreContent {
  settings: StoreSettings;
  categories: Category[];
  products: Product[];
}
