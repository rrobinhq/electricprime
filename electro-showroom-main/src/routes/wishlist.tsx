import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { getProduct } from "@/lib/catalog";
import { useStoreContent } from "@/lib/content-store";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Electro Prime" },
      { name: "description", content: "Products you have saved from the Electro Prime showroom." },
      { property: "og:title", content: "Wishlist — Electro Prime" },
      { property: "og:description", content: "Your saved premium technology from Electro Prime." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { content } = useStoreContent();
  const { wishlist } = useStore();
  const items = wishlist
    .map((id) => getProduct(content.products, id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];

  return (
    <div className="mx-auto max-w-[1600px] px-6 pb-28 pt-28 lg:px-12">
      <p className="eyebrow">Saved</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Wishlist</h1>

      {items.length === 0 ? (
        <p className="mt-12 border border-border p-10 text-sm text-muted-foreground">
          Nothing saved yet.{" "}
          <Link to="/" className="text-signal hover:underline">
            Return to the showroom
          </Link>
          .
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} className="h-full" />
          ))}
        </div>
      )}
    </div>
  );
}
