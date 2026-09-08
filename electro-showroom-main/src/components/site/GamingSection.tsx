import { Link } from "@tanstack/react-router";
import { images } from "@/lib/products";
import { currency } from "@/lib/format";
import { useStoreContent } from "@/lib/content-store";
import { range, useReducedMotion, useScrollProgress } from "@/lib/motion";

/** Gaming: higher-energy scene, still engineered rather than RGB-drenched. */
export function GamingSection() {
  const { content } = useStoreContent();
  const gaming = content.products.filter((p) => p.category === "gaming");
  const hero = gaming[0];
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const reduced = useReducedMotion();
  const p = reduced ? 0.4 : progress;
  const t = range(p, 0.1, 0.8);

  if (!hero) return null;

  return (
    <div ref={ref} className="relative h-[260vh] border-t border-border">
      <section className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden bg-[oklch(0.12_0.006_260)]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "conic-gradient(from 210deg at 60% 40%, oklch(0.24 0.04 40) 0deg, oklch(0.12 0.006 260) 140deg, oklch(0.18 0.03 20) 300deg, oklch(0.12 0.006 260) 360deg)",
            opacity: 0.45 + t * 0.3,
            transform: `rotate(${t * 24}deg) scale(${1.2 + t * 0.2})`,
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-px bg-signal"
          style={{ transform: `scaleX(${t})`, transformOrigin: "left" }}
        />

        <div className="relative mx-auto w-full max-w-[1600px] px-6 lg:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="eyebrow">Chapter 03 — Gaming</p>
              <h2 className="mt-3 text-[12vw] leading-[0.85] sm:text-6xl lg:text-7xl">
                Frame
                <span className="block signal-text">discipline</span>
              </h2>
              <p className="mt-5 max-w-sm text-muted-foreground">
                Vapour-chamber laptops, 360Hz QD-OLED panels and 8000Hz peripherals. Tuned for
                latency, not lighting.
              </p>
              <Link
                to="/category/$slug"
                params={{ slug: "gaming" }}
                className="mt-8 inline-block bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-85"
              >
                Enter the gaming lab
              </Link>
            </div>

            <div className="perspective-stage relative h-[46vh] lg:h-[62vh]">
              <img
                src={images.gamingLaptop}
                alt={hero.name}
                loading="lazy"
                width={1400}
                height={1000}
                className="absolute left-0 top-1/2 w-[86%] -translate-y-1/2 product-shadow"
                style={{
                  transform: `translateY(-50%) rotateY(${18 - t * 26}deg) rotateX(${6 - t * 4}deg) translateX(${(1 - t) * 60}px) scale(${0.9 + t * 0.16})`,
                  opacity: 0.4 + t * 0.6,
                }}
              />
              <img
                src={images.keyboard}
                alt="Vantage Strike Optical keyboard"
                loading="lazy"
                width={1200}
                height={800}
                className="absolute bottom-0 right-0 w-[54%] product-shadow"
                style={{
                  transform: `translateY(${(1 - range(p, 0.35, 0.85)) * 90}px) rotateX(${28 - range(p, 0.35, 0.85) * 18}deg)`,
                  opacity: range(p, 0.3, 0.6),
                }}
              />
              <img
                src={images.mouse}
                alt="Vantage Apex Wireless mouse"
                loading="lazy"
                width={1000}
                height={800}
                className="absolute right-[6%] top-[8%] w-[26%] product-shadow"
                style={{
                  transform: `translateY(${(1 - range(p, 0.5, 0.95)) * -70}px) rotate(${-8 + range(p, 0.5, 0.95) * 8}deg)`,
                  opacity: range(p, 0.45, 0.75),
                }}
              />
            </div>
          </div>

          <div
            className="mt-10 grid gap-4 sm:grid-cols-3"
            style={{ opacity: range(p, 0.55, 0.85) }}
          >
            {gaming.slice(0, 3).map((g) => (
              <Link
                key={g.id}
                to="/product/$productId"
                params={{ productId: g.id }}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border border-border bg-background/40 p-4 backdrop-blur transition-colors hover:border-signal/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm">{g.name}</p>
                  <p className="truncate font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {g.specs["GPU"] !== "—" ? g.specs["GPU"] : g.specs["Display"]}
                  </p>
                </div>
                <span className="shrink-0 font-display">{currency(g.price)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
