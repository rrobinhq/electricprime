import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
  GitCompare,
} from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { currency, getProduct, products } from "@/lib/products";
import { useIsMobile, usePointer, useReducedMotion } from "@/lib/motion";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable — Electro Prime" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — Electro Prime`;
    return {
      meta: [
        { title },
        { name: "description", content: product.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: product.tagline },
      ],
    };
  },
  component: ProductPage,
});

const VIEWS = ["Front", "Angle", "Side", "Rear"] as const;

function ProductPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId)!;
  const { add, toggleWish, wishlist, toggleCompare, compare } = useStore();
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const { ref, pos } = usePointer<HTMLDivElement>(!reduced && !mobile);

  const [view, setView] = useState(1);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [color, setColor] = useState(product.colors[0]!.name);
  const [storage, setStorage] = useState(product.storage?.[0]);
  const [memory, setMemory] = useState(product.memory?.[0]);
  const [qty, setQty] = useState(1);

  const wished = wishlist.includes(product.id);
  const compared = compare.includes(product.id);
  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.category !== product.category).slice(0, 3))
    .slice(0, 4);

  const rotY = drag + view * 42 - 42 + (mobile ? 0 : pos.x * 8);
  const rotX = 6 + (mobile ? 0 : pos.y * -6);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDrag((d) => d + e.movementX * 0.4);
  };

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-28 lg:px-12">
        <nav className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Showroom
          </Link>
          {" / "}
          <Link
            to="/category/$slug"
            params={{ slug: product.category }}
            className="hover:text-foreground"
          >
            {product.category}
          </Link>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          {/* interactive viewer */}
          <div>
            <div
              ref={ref}
              onPointerDown={onPointerDown}
              onPointerUp={() => setDragging(false)}
              onPointerLeave={() => setDragging(false)}
              onPointerMove={onPointerMove}
              className="perspective-stage relative grid aspect-[4/3] cursor-grab place-items-center overflow-hidden border border-border stage active:cursor-grabbing"
            >
              <div className="grid-lines absolute inset-0 opacity-50" />
              <img
                src={product.image}
                alt={`${product.name} — ${VIEWS[view]} view`}
                width={1200}
                height={900}
                className="relative z-10 w-[78%] product-shadow"
                style={{
                  transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.02)`,
                  transformStyle: "preserve-3d",
                  transition: dragging ? "none" : "transform 700ms var(--ease-lab)",
                  filter: "drop-shadow(0 40px 60px oklch(0 0 0 / 0.7))",
                }}
              />
              <p className="absolute bottom-4 left-4 z-20 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Drag to rotate
              </p>
            </div>

            <div className="mt-4 flex gap-3">
              {VIEWS.map((v, i) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setView(i);
                    setDrag(0);
                  }}
                  className={`flex-1 border px-3 py-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    i === view
                      ? "border-signal/70 text-signal"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* purchase panel */}
          <div>
            <p className="eyebrow">{product.brand}</p>
            <h1 className="mt-3 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-muted-foreground">{product.tagline}</p>

            <div className="mt-5 flex items-center gap-4">
              <span className="flex items-center gap-1 font-mono text-xs">
                <Star className="size-3.5 fill-signal text-signal" />
                {product.rating.toFixed(1)}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {product.reviews.toLocaleString()} reviews
              </span>
            </div>

            <div className="mt-6 flex items-end gap-4">
              <p className="font-display text-3xl">{currency(product.price)}</p>
              {product.compareAt && (
                <>
                  <p className="font-mono text-sm text-muted-foreground line-through">
                    {currency(product.compareAt)}
                  </p>
                  <p className="bg-[image:var(--gradient-signal)] px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-signal-foreground">
                    SAVE {currency(product.compareAt - product.price)}
                  </p>
                </>
              )}
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <p className="eyebrow">Finish — {color}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.name)}
                      aria-label={c.name}
                      className={`size-9 rounded-full ring-1 transition-all ${
                        c.name === color ? "ring-2 ring-signal" : "ring-border hover:ring-foreground/40"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {product.memory && (
                <div>
                  <p className="eyebrow">Memory</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {product.memory.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMemory(m)}
                        className={`border px-4 py-2 font-mono text-xs transition-colors ${
                          m === memory ? "border-signal/70 text-signal" : "border-border hover:border-foreground/30"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.storage && (
                <div>
                  <p className="eyebrow">Storage</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {product.storage.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStorage(s)}
                        className={`border px-4 py-2 font-mono text-xs transition-colors ${
                          s === storage ? "border-signal/70 text-signal" : "border-border hover:border-foreground/30"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-border">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid size-11 place-items-center hover:bg-accent"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-10 text-center font-mono text-sm">{qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => q + 1)}
                    className="grid size-11 place-items-center hover:bg-accent"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => add(product, { color, storage, memory, qty })}
                  className="flex-1 bg-primary px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-85"
                >
                  Add to bag
                </button>
                <button
                  type="button"
                  onClick={() => add(product, { color, storage, memory, qty })}
                  className="flex-1 bg-[image:var(--gradient-signal)] px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-signal-foreground transition-opacity hover:opacity-90"
                >
                  Buy now
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => toggleWish(product.id)}
                  className={`flex items-center gap-2 border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    wished ? "border-signal/70 text-signal" : "border-border hover:border-signal/50"
                  }`}
                >
                  <Heart className={`size-4 ${wished ? "fill-signal" : ""}`} /> Wishlist
                </button>
                <button
                  type="button"
                  onClick={() => toggleCompare(product.id)}
                  className={`flex items-center gap-2 border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    compared ? "border-signal/70 text-signal" : "border-border hover:border-signal/50"
                  }`}
                >
                  <GitCompare className="size-4" /> Compare
                </button>
              </div>

              <ul className="grid gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Truck className="size-4 shrink-0 text-signal" /> Free insured 2-day delivery,
                  dispatched within 24 h
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="size-4 shrink-0 text-signal" /> 3-year Prime Care warranty
                  with accidental cover
                </li>
                <li className="flex items-center gap-3">
                  <RotateCcw className="size-4 shrink-0 text-signal" /> 30-day returns, no
                  restocking fee
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* specifications */}
        <section className="mt-24">
          <Reveal>
            <p className="eyebrow">Specification sheet</p>
            <h2 className="mt-3 text-3xl">Every number, stated plainly</h2>
          </Reveal>
          <dl className="mt-10 grid gap-x-12 border-t border-border sm:grid-cols-2">
            {Object.entries(product.specs).map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 border-b border-border py-4"
              >
                <dt className="eyebrow">{k}</dt>
                <dd className="font-mono text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <h2 className="text-3xl">Pairs well with</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
