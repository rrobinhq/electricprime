import { Link } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { categories, currency, products } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const featured = products.filter((p) => p.featured);

export function Header() {
  const { count, setSearchOpen, setCartOpen, wishlist } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const megaCategory = categories.find((c) => c.slug === open);
  const megaItems = megaCategory
    ? products.filter((p) => p.category === megaCategory.slug).slice(0, 4)
    : [];

  return (
    <header
      onMouseLeave={() => setOpen(null)}
      className={cn(
        "fixed inset-x-0 top-0 z-[60] transition-colors duration-500",
        scrolled || open ? "border-b border-border bg-background/85 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-4 lg:px-12">
        <Link to="/" className="shrink-0 font-display text-lg tracking-[-0.05em]">
          ELECTRO<span className="signal-text"> PRIME</span>
        </Link>

        <nav className="hidden justify-center gap-7 lg:flex">
          {categories.slice(0, 7).map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              onMouseEnter={() => setOpen(c.slug)}
              onFocus={() => setOpen(c.slug)}
              className={cn(
                "relative py-1 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors",
                open === c.slug ? "text-signal" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="grid size-10 place-items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <Search className="size-[18px]" />
          </button>
          <Link
            to="/account"
            aria-label="Account"
            className="hidden size-10 place-items-center text-muted-foreground transition-colors hover:text-foreground sm:grid"
          >
            <User className="size-[18px]" />
          </Link>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative grid size-10 place-items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <Heart className="size-[18px]" />
            {wishlist.length > 0 && (
              <span className="absolute right-1 top-1 size-1.5 rounded-full bg-signal" />
            )}
          </Link>
          <button
            type="button"
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
            className="relative grid size-10 place-items-center transition-colors hover:text-signal"
          >
            <ShoppingBag className="size-[18px]" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-signal font-mono text-[9px] text-signal-foreground">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-10 place-items-center lg:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* mega panel */}
      <div
        className={cn(
          "hidden overflow-hidden border-t border-border transition-[max-height,opacity] duration-500 ease-[var(--ease-lab)] lg:block",
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {megaCategory && (
          <div className="mx-auto grid max-w-[1600px] grid-cols-[260px_minmax(0,1fr)] gap-10 px-12 py-10">
            <div>
              <p className="eyebrow">{megaCategory.name}</p>
              <p className="mt-3 text-2xl leading-tight">{megaCategory.blurb}</p>
              <Link
                to="/category/$slug"
                params={{ slug: megaCategory.slug }}
                onClick={() => setOpen(null)}
                className="mt-6 inline-block border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:border-signal/60"
              >
                Enter chapter
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-5">
              {megaItems.map((p, i) => (
                <Link
                  key={p.id}
                  to="/product/$productId"
                  params={{ productId: p.id }}
                  onClick={() => setOpen(null)}
                  className="group anim-mask-up border border-border bg-surface/50 p-3 transition-colors hover:border-signal/50"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="grid aspect-[4/3] place-items-center bg-[image:var(--gradient-stage)]">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={240}
                      height={180}
                      className="h-4/5 w-4/5 object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 truncate text-sm">{p.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {currency(p.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-6 lg:hidden">
          <ul className="grid gap-4">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-2xl"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/compare"
                onClick={() => setMobileOpen(false)}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                Compare specifications
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
