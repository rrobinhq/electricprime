import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/products";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl tracking-[-0.04em]">
              ELECTRO<span className="signal-text"> PRIME</span>
            </p>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              A digital showroom for precision consumer technology. Engineered inventory, curated
              by specification.
            </p>
            <p className="eyebrow mt-8">Est. 2019 — Rotterdam / Singapore</p>
          </div>
          <div>
            <p className="eyebrow">Shop</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {categories.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className="transition-colors hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Explore</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/compare" className="transition-colors hover:text-foreground">
                  Specification compare
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="transition-colors hover:text-foreground">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/category/$slug"
                  params={{ slug: "gaming" }}
                  className="transition-colors hover:text-foreground"
                >
                  Gaming lab
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Service</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Free 2-day delivery</li>
              <li>3-year Prime Care</li>
              <li>30-day returns</li>
              <li>Trade-in valuation</li>
            </ul>
          </div>
        </div>
        <div className="hairline mt-14 flex flex-wrap items-center justify-between gap-4 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>© {new Date().getFullYear()} Electro Prime</span>
          <span>Precision · Performance · Provenance</span>
        </div>
      </div>
    </footer>
  );
}
