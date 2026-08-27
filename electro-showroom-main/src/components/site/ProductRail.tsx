import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

export function ProductRail({
  title,
  eyebrow,
  items,
  href,
}: {
  title: string;
  eyebrow?: string;
  items: Product[];
  href?: { to: string; params?: Record<string, string> };
}) {
  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 className="mt-3 text-3xl sm:text-4xl">{title}</h2>
          </div>
          {href && (
            <Link
              to={href.to}
              params={href.params as never}
              className="group flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        <div className="scroll-rail -mx-6 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 lg:-mx-12 lg:px-12">
          {items.map((p, i) => (
            <Reveal
              key={p.id}
              delay={i * 60}
              className="w-[300px] shrink-0 snap-start sm:w-[340px]"
            >
              <ProductCard product={p} className="h-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
