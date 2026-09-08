# Electro Prime — storefront-wiring: COMPLETE ✅

All "wire the storefront to the content store" work is done and typechecks
clean (`npx tsc --noEmit` from `electric/` → 0 errors).

## What this project is
A storefront (like an Apple-style tech store) with a password-gated
`/studio` admin panel. The owner edits products/categories/settings in
Studio, hits "Save to server," and it persists to Redis via
`src/server-fns/content.ts`. The site now reads from that saved content
everywhere it matters — not from the old hardcoded file.

## Architecture recap (for future reference)
- OLD: `src/lib/products.ts` — legacy hardcoded array. Now ONLY used for
  (a) its `images` export (bundled decorative PNGs — heroLaptop, phone,
  monitor, etc. — these are fine to keep using directly since they're
  static assets, not part of the editable Product schema which uses
  `image: string` URLs instead), and (b) seeding `src/data/defaults.ts`
  (the fallback content Studio starts from before anyone edits anything
  — this is intentional, not a bug).
- NEW: `src/lib/content-store.tsx` → `useStoreContent()` hook → gives
  `{ content }` where `content.products` / `content.categories` /
  `content.settings` are the LIVE, Studio-editable data.
- Helpers: `src/lib/format.ts` (currency), `src/lib/catalog.ts`
  (getProduct/byCategory/searchProducts — same logic as the old
  products.ts helpers, but take the product list as an argument).

## Full list of files touched in this migration
Components (all now read product data from `useStoreContent()`):
Header, Footer, SearchOverlay, ProductCard, ProductRail, CartDrawer,
Hero, GamingSection, PhoneStudio, AccessoriesStack, LaptopShowroom.

Cart logic: `src/lib/store.tsx` — `detailed` memo now looks products up
via `getProduct(content.products, id)` using `useStoreContent()`.

Routes — the hard part, since some use server-side loaders that run
before React renders (so `useStoreContent()`, a React hook, can't be
called there). Fixed by calling `getStoreContent()` (the server function
from `src/server-fns/content.ts`) directly inside each loader:
- `src/routes/index.tsx` — loader fetches content, passes
  `{ categories, products }` via `Route.useLoaderData()`
- `src/routes/category.$slug.tsx` — loader fetches content, finds the
  category, returns `{ category, products }`
- `src/routes/product.$productId.tsx` — loader fetches content, finds
  the product, returns `{ product, products }` (products used for the
  "Pairs well with" related-items rail)
- `src/routes/compare.tsx` — no loader; used `useStoreContent()` directly
  since it's pure client interactivity
- `src/routes/wishlist.tsx` — same, no loader needed

Pattern used throughout components: call `useStoreContent()`, derive the
needed product(s) from `content.products` INSIDE the component body
(never at module scope — data is dynamic now). Call all hooks
unconditionally first, THEN add `if (!product) return null;` AFTER the
hooks, so React's rules-of-hooks are satisfied while still handling a
product that's still loading or was deleted in Studio.

## Verification done
- `npx tsc --noEmit` — passes, 0 errors.
- NOT yet done: running the dev server / visually testing in a browser,
  or deploying. Recommended next step before deploying: `npm run dev`
  (or equivalent) and click through homepage → category → product page →
  compare → wishlist → cart, then edit something in `/studio`, save, and
  confirm the storefront reflects it.

## Still pending (separate, later tasks — NOT part of this migration)
- Set real env vars in Vercel (ADMIN_PASSWORD, SESSION_SECRET,
  KV_REST_API_URL / KV_REST_API_TOKEN via Upstash integration)
- Admin bar / "Studio mode" strip on the storefront — copy the pattern
  from the reference "portfolio" project's
  `src/components/site/AdminBar.tsx` and `src/routes/admin.tsx`
- Chatbot / shopping assistant — copy the pattern from the reference
  "portfolio" project's `src/components/site/ChatbotDock.tsx` and
  `src/server-fns/chatbot.ts` (Gemini, grounded in `content.products`)

