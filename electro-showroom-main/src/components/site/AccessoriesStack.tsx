import { Link } from "@tanstack/react-router";
import { images } from "@/lib/products";
import { currency } from "@/lib/format";
import { useStoreContent } from "@/lib/content-store";
import { range, useReducedMotion, useScrollProgress } from "@/lib/motion";
import { useStore } from "@/lib/store";

const LAYERS = [
  { id: "prime-view-40-ultrawide", img: images.monitor, at: 0.0, w: "72%", y: -14, z: 0 },
  { id: "prime-keys-tkl", img: images.keyboard, at: 0.18, w: "58%", y: 18, z: 1 },
  { id: "prime-glide-mx", img: images.mouse, at: 0.36, w: "18%", y: 26, z: 2 },
  { id: "prime-sound-one", img: images.headphones, at: 0.54, w: "24%", y: 6, z: 3 },
  { id: "prime-buds-pro", img: images.earbuds, at: 0.72, w: "18%", y: 34, z: 4 },
];

/** Accessories: the workstation assembles itself layer by layer. */
export function AccessoriesStack() {
  const { content } = useStoreContent();
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const reduced = useReducedMotion();
  const { add } = useStore();
  const p = reduced ? 1 : progress;

  const mapped = LAYERS.map((l) => ({
    ...l,
    product: content.products.find((x) => x.id === l.id),
  }));
  const items = mapped.filter(
    (l): l is (typeof mapped)[number] & { product: NonNullable<(typeof mapped)[number]["product"]> } =>
      Boolean(l.product),
  );
  const activeIdx = items.reduce((acc, l, i) => (p >= l.at ? i : acc), 0);
  const active = items[activeIdx];

  if (!active) return null;

  return (
    <div ref={ref} className="relative h-[340vh] border-t border-border">
      <section className="sticky top-0 h-dvh overflow-hidden stage">
        <div className="grid-lines absolute inset-0 opacity-50" />
        <div className="relative mx-auto grid h-full max-w-[1600px] grid-rows-[auto_1fr_auto] px-6 pb-10 pt-24 lg:px-12">
          <header>
            <p className="eyebrow">Chapter 04 — Accessories</p>
            <h2 className="mt-3 max-w-xl text-4xl sm:text-5xl">
              One workstation, assembled piece by piece
            </h2>
          </header>

          <div className="perspective-stage relative">
            {items.map((l, i) => {
              const t = range(p, l.at, l.at + 0.16);
              return (
                <img
                  key={l.id}
                  src={l.img}
                  alt={l.product.name}
                  loading="lazy"
                  width={1000}
                  height={800}
                  className="absolute left-1/2 top-1/2 product-shadow"
                  style={{
                    width: l.w,
                    zIndex: l.z,
                    opacity: t,
                    transform: `translate(-50%, calc(-50% + ${l.y}%)) translateZ(${l.z * 30}px) translateY(${(1 - t) * 90}px) rotateX(${(1 - t) * 26}deg) scale(${0.9 + t * 0.1})`,
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                  }}
                />
              );
            })}
            <div className="absolute bottom-4 left-0 max-w-xs">
              <p className="eyebrow">Layer {String(activeIdx + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-2xl">{active.product.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{active.product.tagline}</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="font-display text-lg">{currency(active.product.price)}</span>
                <button
                  type="button"
                  onClick={() => add(active.product)}
                  className="border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:border-signal/60"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-1.5">
              {items.map((l, i) => (
                <span
                  key={l.id}
                  className={`h-0.5 w-10 transition-colors duration-500 ${
                    i <= activeIdx ? "bg-signal" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <Link
              to="/category/$slug"
              params={{ slug: "accessories" }}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Browse all accessories
            </Link>
          </footer>
        </div>
      </section>
    </div>
  );
}
