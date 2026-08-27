import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { LaptopShowroom } from "@/components/site/LaptopShowroom";
import { PhoneStudio } from "@/components/site/PhoneStudio";
import { GamingSection } from "@/components/site/GamingSection";
import { AccessoriesStack } from "@/components/site/AccessoriesStack";
import { ProductRail } from "@/components/site/ProductRail";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { categories, products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Electro Prime — The Premium Technology Showroom" },
      {
        name: "description",
        content:
          "Explore flagship laptops, titanium phones, ultrawide monitors, audio and gaming hardware inside the Electro Prime interactive showroom.",
      },
      { property: "og:title", content: "Electro Prime — The Premium Technology Showroom" },
      {
        property: "og:description",
        content:
          "An interactive digital showroom for premium consumer technology. Rotate, configure and compare before you buy.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.filter((p) => p.featured);
  const newIn = products.slice(4, 12);
  const editorial = products.filter((p) => p.category === "monitors" || p.category === "audio");

  return (
    <>
      <Hero />
      <LaptopShowroom />

      <ProductRail
        eyebrow="Selected inventory"
        title="Featured this season"
        items={featured}
        href={{ to: "/category/$slug", params: { slug: "laptops" } }}
      />

      <PhoneStudio />

      {/* editorial asymmetric block */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <Reveal>
            <p className="eyebrow">Desk surfaces</p>
            <h2 className="mt-3 max-w-2xl text-4xl sm:text-5xl">
              Viewing and listening, calibrated at the factory
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
            <Reveal variant="materialize" className="h-full">
              <ProductCard product={editorial[0]!} size="lg" className="h-full" />
            </Reveal>
            <div className="grid gap-6">
              {editorial.slice(1, 3).map((p, i) => (
                <Reveal key={p.id} variant="materialize" delay={120 + i * 120}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <GamingSection />
      <AccessoriesStack />

      <ProductRail eyebrow="Just landed" title="New in the showroom" items={newIn} />

      {/* category chapters */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <Reveal>
            <p className="eyebrow">Chapters</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Walk the floor</h2>
          </Reveal>
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {categories.map((c, i) => (
              <li key={c.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 py-6 transition-colors hover:bg-surface/60"
                >
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-2xl transition-transform duration-500 group-hover:translate-x-2 sm:text-3xl">
                      {c.name}
                    </span>
                    <span className="mt-1 block truncate text-sm text-muted-foreground">
                      {c.blurb}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-4">
                    <img
                      src={c.image}
                      alt=""
                      loading="lazy"
                      width={120}
                      height={80}
                      className="hidden h-14 w-24 object-contain opacity-40 transition-opacity duration-500 group-hover:opacity-100 sm:block"
                    />
                    <ArrowUpRight className="size-5 text-muted-foreground transition-colors group-hover:text-signal" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* compare CTA */}
      <section className="border-t border-border stage py-24">
        <div className="mx-auto grid max-w-[1600px] items-end gap-8 px-6 lg:grid-cols-[1fr_auto] lg:px-12">
          <Reveal>
            <p className="eyebrow">Specification desk</p>
            <h2 className="mt-3 max-w-2xl text-4xl sm:text-5xl">
              Put two machines side by side, line by line
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              CPU, GPU, memory, display, battery, ports and mass — compared without marketing
              language.
            </p>
          </Reveal>
          <Link
            to="/compare"
            className="inline-block shrink-0 bg-[image:var(--gradient-signal)] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-signal-foreground transition-opacity hover:opacity-90"
          >
            Open comparison
          </Link>
        </div>
      </section>
    </>
  );
}
