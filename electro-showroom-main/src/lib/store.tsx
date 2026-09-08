import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/types";
import { getProduct } from "./catalog";
import { useStoreContent } from "./content-store";

export type CartLine = {
  key: string;
  id: string;
  qty: number;
  color?: string | undefined;
  storage?: string | undefined;
  memory?: string | undefined;
};

type StoreState = {
  lines: CartLine[];
  wishlist: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  compare: string[];
};

type StoreApi = StoreState & {
  add: (p: Product, opts?: {
    color?: string | undefined;
    storage?: string | undefined;
    memory?: string | undefined;
    qty?: number | undefined;
  }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  toggleWish: (id: string) => void;
  toggleCompare: (id: string) => void;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  count: number;
  subtotal: number;
  detailed: { line: CartLine; product: Product }[];
};

const StoreContext = createContext<StoreApi | null>(null);
const KEY = "electro-prime-store-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const { content } = useStoreContent();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoreState>;
        setLines(parsed.lines ?? []);
        setWishlist(parsed.wishlist ?? []);
        setCompare(parsed.compare ?? []);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ lines, wishlist, compare }));
    } catch {
      /* ignore */
    }
  }, [lines, wishlist, compare, hydrated]);

  const add = useCallback<StoreApi["add"]>((p, opts = {}) => {
    const color = opts.color ?? p.colors?.[0]?.name;
    const storage = opts.storage ?? p.storage?.[0];
    const memory = opts.memory ?? p.memory?.[0];
    const key = [p.id, color, storage, memory].filter(Boolean).join("|");
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + (opts.qty ?? 1) } : l));
      }
      return [...prev, { key, id: p.id, qty: opts.qty ?? 1, color, storage, memory }];
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const toggleWish = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompare((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-3),
    );
  }, []);

  const detailed = useMemo(
    () =>
      lines
        .map((line) => ({ line, product: getProduct(content.products, line.id) }))
        .filter((x): x is { line: CartLine; product: Product } => Boolean(x.product)),
    [lines, content.products],
  );

  const value = useMemo<StoreApi>(
    () => ({
      lines,
      wishlist,
      compare,
      cartOpen,
      searchOpen,
      add,
      setQty,
      remove,
      toggleWish,
      toggleCompare,
      setCartOpen,
      setSearchOpen,
      detailed,
      count: lines.reduce((a, l) => a + l.qty, 0),
      subtotal: detailed.reduce((a, { line, product }) => a + product.price * line.qty, 0),
    }),
    [
      lines,
      wishlist,
      compare,
      cartOpen,
      searchOpen,
      add,
      setQty,
      remove,
      toggleWish,
      toggleCompare,
      detailed,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
