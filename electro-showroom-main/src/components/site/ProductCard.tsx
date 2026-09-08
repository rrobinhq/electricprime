import { Link } from "@tanstack/react-router";
import { Heart, Plus, Star, GitCompare } from "lucide-react";
import { useRef, useState } from "react";
import { currency } from "@/lib/format";
import type { Product } from "@/data/types";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  className,
  size = "md",
}: {
  product: Product;
  className?: string;
  size?: "md" | "lg";
}) {
  const { add, toggleWish, wishlist, toggleCompare, compare } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const wished = wishlist.includes(product.id);
  const compared = compare.includes(product.id);
  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : 0;

  const onMove = (e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -8,
      y: ((e.clientX - r.left) / r.width - 0.5) * 10,
    });
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className={cn(
        "group relative flex flex-col border border-border bg-surface/60 transition-colors duration-500 hover:border-signal/40",
        className,
      )}
      style={{ perspective: "1000px" }}
    >
      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="relative block overflow-hidden"
      >
        <div
          className={cn(
            "relative flex items-center justify-center overflow-hidden bg-[image:var(--gradient-stage)]",
            size === "lg" ? "aspect-[4/3]" : "aspect-square",
          )}
        >
          <div
            className="grid-lines absolute inset-0 opacity-40 transition-transform duration-700"
            style={{ transform: `scale(1.1) translate(${tilt.y * -0.6}%, ${tilt.x * 0.6}%)` }}
          />
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={600}
            className="relative z-10 h-[76%] w-[80%] object-contain product-shadow transition-transform duration-500 ease-[var(--ease-lab)] group-hover:scale-[1.06]"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(40px)`,
              transformStyle: "preserve-3d",
            }}
          />
          {discount > 0 && (
            <span className="absolute left-0 top-0 z-20 bg-[image:var(--gradient-signal)] px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-signal-foreground">
              −{discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">{product.brand}</p>
            <h3 className="mt-1 truncate text-base font-semibold">{product.name}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground">
            <Star className="size-3 fill-signal text-signal" />
            {product.rating.toFixed(1)}
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{product.tagline}</p>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
          {Object.entries(product.specs)
            .filter(([, v]) => v !== "—")
            .slice(0, 4)
            .map(([k, v]) => (
              <div key={k} className="truncate">
                <dt className="inline text-foreground/50">{k} </dt>
                <dd className="inline">{v}</dd>
              </div>
            ))}
        </dl>

        {product.colors.length > 1 && (
          <div className="flex items-center gap-2">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="size-3.5 rounded-full ring-1 ring-border"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.storage && (
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                {product.storage[0]}–{product.storage[product.storage.length - 1]}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="font-display text-xl">{currency(product.price)}</p>
            {product.compareAt && (
              <p className="font-mono text-xs text-muted-foreground line-through">
                {currency(product.compareAt)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={compared ? "Remove from comparison" : "Add to comparison"}
              onClick={() => toggleCompare(product.id)}
              className={cn(
                "grid size-9 place-items-center border border-border transition-colors hover:border-signal/60",
                compared && "border-signal/70 text-signal",
              )}
            >
              <GitCompare className="size-4" />
            </button>
            <button
              type="button"
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleWish(product.id)}
              className={cn(
                "grid size-9 place-items-center border border-border transition-colors hover:border-signal/60",
                wished && "border-signal/70 text-signal",
              )}
            >
              <Heart className={cn("size-4", wished && "fill-signal")} />
            </button>
            <button
              type="button"
              onClick={() => add(product)}
              className="flex h-9 items-center gap-1.5 bg-primary px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85"
            >
              <Plus className="size-3.5" /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
