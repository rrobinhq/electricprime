import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { byCategory } from "@/lib/catalog";
import type { CategorySlug } from "@/data/types";
import { useReducedMotion, useScrollProgress } from "@/lib/motion";
import { getStoreContent } from "@/server-fns/content";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    const content = await getStoreContent();
    const category = content.categories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category, products: content.products };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Category unavailable — Electro Prime" }, { name: "robots", content: "noindex" }],
      };
    }
    const { category } = loaderData;
    const title = `${category.name} — Electro Prime Showroom`;
    return {
      meta: [
        { title },
        { name: "description", content: `${category.blurb} Shop ${category.name.toLowerCase()} at Electro Prime.` },
        { property: "og:title", content: title },
        { property: "og:description", content: category.blurb },
      ],
    };
  },
  component: CategoryPage,
});

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

function CategoryPage() {
  const { category, products } = Route.useLoaderData();
  const [sort, setSort] = useState<SortKey>("featured");
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const reduced = useReducedMotion();
  const p = reduced ? 0 : progress;

  const items = [...byCategory(products, category.slug as CategorySlug)].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });

  return (
    <>
      <div ref={ref} className="relative h-[130vh]">
        <section className="sticky top-0 flex h-[85vh] items-end overflow-hidden stage">
          <div className="grid-lines absolute inset-0 opacity-50" />
          <img
            src={category.image}
            alt={category.name}
            width={1200}
            height={900}
            className="pointer-events-none absolute right-[-4%] top-1/2 w-[62%] -translate-y-1/2 product-shadow"
            style={{
              transform: `translateY(-50%) rotateY(${-12 + p * 24}deg) scale(${1 - p * 0.15})`,
              opacity: 1 - p * 0.8,
            }}
          />
          <div className="relative mx-auto w-full max-w-[1600px] px-6 pb-16 lg:px-12">
            <p className="eyebrow">Chapter — {category.slug}</p>
            <h1
              className="mt-4 max-w-[14ch] text-[15vw] leading-[0.84] sm:text-[9vw] lg:text-[7vw]"
              style={{ transform: `translateY(${p * -60}px)`, opacity: 1 - p * 1.2 }}
            >
              {category.name}
            </h1>
            <p className="mt-6 max-w-md text-muted-foreground">{category.blurb}</p>
          </div>
        </section>
      </div>

      <section className="relative z-10 border-t border-border bg-background pb-28 pt-10">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border pb-5">
            <p className="min-w-0 truncate font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {items.length} products
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              {(
                [
                  ["featured", "Featured"],
                  ["price-asc", "Price ↑"],
                  ["price-desc", "Price ↓"],
                  ["rating", "Rating"],
                ] as [SortKey, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSort(key)}
                  className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    sort === key
                      ? "border-signal/70 text-signal"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((product, i) => (
              <Reveal
                key={product.id}
                delay={i * 70}
                variant={i % 3 === 0 ? "materialize" : "mask-up"}
                className={i === 0 ? "sm:col-span-2" : undefined}
              >
                <ProductCard
                  product={product}
                  size={i === 0 ? "lg" : "md"}
                  className="h-full"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
