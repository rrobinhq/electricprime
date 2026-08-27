import heroLaptop from "@/assets/hero-laptop.png";
import gamingLaptop from "@/assets/gaming-laptop.png";
import phone from "@/assets/phone.png";
import tablet from "@/assets/tablet.png";
import monitor from "@/assets/monitor.png";
import keyboard from "@/assets/keyboard.png";
import mouse from "@/assets/mouse.png";
import headphones from "@/assets/headphones.png";
import earbuds from "@/assets/earbuds.png";
import desktop from "@/assets/desktop.png";

export const images = {
  heroLaptop,
  gamingLaptop,
  phone,
  tablet,
  monitor,
  keyboard,
  mouse,
  headphones,
  earbuds,
  desktop,
};

export type CategorySlug =
  | "laptops"
  | "phones"
  | "tablets"
  | "computers"
  | "monitors"
  | "accessories"
  | "gaming"
  | "audio";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  image: string;
  tagline: string;
  colors: { name: string; hex: string }[];
  storage?: string[];
  memory?: string[];
  specs: Record<string, string>;
  featured?: boolean;
};

export const categories: {
  slug: CategorySlug;
  name: string;
  blurb: string;
  image: string;
}[] = [
  {
    slug: "laptops",
    name: "Laptops",
    blurb: "Machined chassis, silicon-class performance.",
    image: heroLaptop,
  },
  { slug: "phones", name: "Phones", blurb: "Titanium frames, computational optics.", image: phone },
  { slug: "tablets", name: "Tablets", blurb: "Canvas, console, notebook — one slab.", image: tablet },
  { slug: "computers", name: "Computers", blurb: "Desktop compute and storage cores.", image: desktop },
  { slug: "monitors", name: "Monitors", blurb: "Colour-calibrated viewing surfaces.", image: monitor },
  {
    slug: "accessories",
    name: "Accessories",
    blurb: "The workstation, assembled piece by piece.",
    image: keyboard,
  },
  { slug: "gaming", name: "Gaming", blurb: "Latency measured in microseconds.", image: gamingLaptop },
  { slug: "audio", name: "Audio", blurb: "Silence engineered, then broken.", image: headphones },
];

const P = (p: Product) => p;

export const products: Product[] = [
  P({
    id: "prime-book-x16",
    name: "Prime Book X16",
    brand: "Electro Prime",
    category: "laptops",
    price: 2499,
    compareAt: 2799,
    rating: 4.9,
    reviews: 1284,
    image: heroLaptop,
    tagline: "A 16-inch aluminium monolith with a 40-core neural engine.",
    colors: [
      { name: "Graphite", hex: "#3a3d42" },
      { name: "Silver", hex: "#c8ccd2" },
      { name: "Midnight", hex: "#1b1e24" },
    ],
    storage: ["512GB", "1TB", "2TB", "4TB"],
    memory: ["16GB", "32GB", "64GB"],
    specs: {
      CPU: "Prime M5 Pro, 14-core",
      GPU: "30-core integrated",
      RAM: "16–64GB unified",
      Storage: "512GB–4TB NVMe",
      Display: '16.2" 3456×2234 XDR, 120Hz',
      Battery: "22 hours video",
      Ports: "3× TB5, HDMI 2.1, SDXC, MagLink",
      Weight: "1.62 kg",
      Connectivity: "Wi-Fi 7, Bluetooth 5.4",
    },
    featured: true,
  }),
  P({
    id: "prime-book-air-14",
    name: "Prime Book Air 14",
    brand: "Electro Prime",
    category: "laptops",
    price: 1399,
    rating: 4.8,
    reviews: 942,
    image: heroLaptop,
    tagline: "11.2 mm of fanless silence.",
    colors: [
      { name: "Silver", hex: "#c8ccd2" },
      { name: "Graphite", hex: "#3a3d42" },
    ],
    storage: ["256GB", "512GB", "1TB"],
    memory: ["16GB", "24GB"],
    specs: {
      CPU: "Prime M5, 10-core",
      GPU: "10-core integrated",
      RAM: "16–24GB unified",
      Storage: "256GB–1TB NVMe",
      Display: '14.0" 2880×1864, 120Hz',
      Battery: "19 hours video",
      Ports: "2× TB4, MagLink",
      Weight: "1.19 kg",
      Connectivity: "Wi-Fi 7, Bluetooth 5.4",
    },
  }),
  P({
    id: "vantage-16-rtx",
    name: "Vantage 16 RTX",
    brand: "Vantage",
    category: "gaming",
    price: 2899,
    compareAt: 3199,
    rating: 4.7,
    reviews: 613,
    image: gamingLaptop,
    tagline: "Vapour chamber, 240Hz, zero thermal apology.",
    colors: [
      { name: "Obsidian", hex: "#14161a" },
      { name: "Ember", hex: "#c4661f" },
    ],
    storage: ["1TB", "2TB", "4TB"],
    memory: ["16GB", "32GB", "64GB"],
    specs: {
      CPU: "Core Ultra 9 285HX",
      GPU: "RTX 5090 Laptop, 24GB",
      RAM: "16–64GB DDR5-6400",
      Storage: "1TB–4TB Gen5 NVMe",
      Display: '16" 2560×1600 Mini-LED, 240Hz',
      Battery: "8 hours mixed",
      Ports: "2× TB5, 2× USB-A, HDMI 2.1, RJ45",
      Weight: "2.38 kg",
      Connectivity: "Wi-Fi 7, Bluetooth 5.4",
    },
    featured: true,
  }),
  P({
    id: "prime-phone-17-pro",
    name: "Prime Phone 17 Pro",
    brand: "Electro Prime",
    category: "phones",
    price: 1199,
    compareAt: 1299,
    rating: 4.9,
    reviews: 3120,
    image: phone,
    tagline: "Grade-5 titanium. A four-sensor optical stack.",
    colors: [
      { name: "Natural Titanium", hex: "#8d8378" },
      { name: "Black Titanium", hex: "#26262a" },
      { name: "Desert", hex: "#b79a76" },
      { name: "Glacier", hex: "#c9d4dc" },
    ],
    storage: ["256GB", "512GB", "1TB"],
    specs: {
      CPU: "Prime A19 Bionic",
      GPU: "6-core, hardware ray tracing",
      RAM: "12GB",
      Storage: "256GB–1TB",
      Display: '6.3" 2622×1206 LTPO, 1–120Hz',
      Battery: "33 hours video",
      Camera: "48MP main + 48MP UW + 120mm tetraprism",
      Ports: "USB-C 3.2",
      Weight: "199 g",
      Connectivity: "5G mmWave, Wi-Fi 7, UWB",
    },
    featured: true,
  }),
  P({
    id: "prime-phone-17",
    name: "Prime Phone 17",
    brand: "Electro Prime",
    category: "phones",
    price: 899,
    rating: 4.7,
    reviews: 1875,
    image: phone,
    tagline: "The essential flagship, aluminium and light.",
    colors: [
      { name: "Slate", hex: "#4a4e55" },
      { name: "Mist", hex: "#cfd6db" },
    ],
    storage: ["128GB", "256GB", "512GB"],
    specs: {
      CPU: "Prime A19",
      GPU: "5-core",
      RAM: "8GB",
      Storage: "128GB–512GB",
      Display: '6.1" 2556×1179 OLED, 120Hz',
      Battery: "27 hours video",
      Camera: "48MP main + 12MP UW",
      Ports: "USB-C 3.0",
      Weight: "171 g",
      Connectivity: "5G, Wi-Fi 7",
    },
  }),
  P({
    id: "prime-pad-13",
    name: "Prime Pad 13 Ultra",
    brand: "Electro Prime",
    category: "tablets",
    price: 1099,
    rating: 4.8,
    reviews: 512,
    image: tablet,
    tagline: "A tandem-OLED canvas with a detachable deck.",
    colors: [
      { name: "Space Grey", hex: "#494c52" },
      { name: "Silver", hex: "#c8ccd2" },
    ],
    storage: ["256GB", "512GB", "1TB"],
    memory: ["8GB", "16GB"],
    specs: {
      CPU: "Prime M4",
      GPU: "10-core",
      RAM: "8–16GB",
      Storage: "256GB–1TB",
      Display: '13" Tandem OLED, 120Hz',
      Battery: "14 hours",
      Ports: "TB4",
      Weight: "582 g",
      Connectivity: "Wi-Fi 7, 5G option",
    },
  }),
  P({
    id: "prime-cube-studio",
    name: "Prime Cube Studio",
    brand: "Electro Prime",
    category: "computers",
    price: 2199,
    rating: 4.8,
    reviews: 288,
    image: desktop,
    tagline: "A 4-litre aluminium block that renders in real time.",
    colors: [{ name: "Graphite", hex: "#33363b" }],
    storage: ["1TB", "2TB", "8TB"],
    memory: ["32GB", "64GB", "128GB"],
    specs: {
      CPU: "Prime M5 Max, 16-core",
      GPU: "40-core",
      RAM: "32–128GB unified",
      Storage: "1TB–8TB NVMe",
      Display: "Up to 4× 6K external",
      Battery: "—",
      Ports: "4× TB5, 2× USB-A, 10GbE, HDMI",
      Weight: "2.7 kg",
      Connectivity: "Wi-Fi 7, Bluetooth 5.4",
    },
  }),
  P({
    id: "prime-vault-ssd",
    name: "Prime Vault 4TB SSD",
    brand: "Electro Prime",
    category: "computers",
    price: 349,
    compareAt: 429,
    rating: 4.6,
    reviews: 744,
    image: desktop,
    tagline: "3,100 MB/s in a pocketable ingot.",
    colors: [{ name: "Graphite", hex: "#33363b" }],
    storage: ["1TB", "2TB", "4TB"],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "1TB–4TB NVMe",
      Display: "—",
      Battery: "—",
      Ports: "USB-C 3.2 Gen 2×2",
      Weight: "78 g",
      Connectivity: "USB-C",
    },
  }),
  P({
    id: "prime-view-40-ultrawide",
    name: "Prime View 40 Ultrawide",
    brand: "Electro Prime",
    category: "monitors",
    price: 1599,
    compareAt: 1799,
    rating: 4.7,
    reviews: 401,
    image: monitor,
    tagline: "5120×2160 of factory-calibrated real estate.",
    colors: [{ name: "Graphite", hex: "#2f3237" }],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "—",
      Display: '39.7" 5120×2160 Nano-IPS, 144Hz',
      Battery: "—",
      Ports: "TB4 96W, 2× HDMI 2.1, DP 2.1",
      Weight: "9.4 kg",
      Connectivity: "KVM, Thunderbolt daisy-chain",
    },
    featured: true,
  }),
  P({
    id: "vantage-view-27-oled",
    name: "Vantage View 27 OLED",
    brand: "Vantage",
    category: "gaming",
    price: 899,
    rating: 4.8,
    reviews: 356,
    image: monitor,
    tagline: "360Hz QD-OLED with 0.03 ms response.",
    colors: [{ name: "Obsidian", hex: "#16181c" }],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "—",
      Display: '26.5" 2560×1440 QD-OLED, 360Hz',
      Battery: "—",
      Ports: "DP 2.1, 2× HDMI 2.1, USB hub",
      Weight: "7.1 kg",
      Connectivity: "G-Sync, FreeSync Premium Pro",
    },
  }),
  P({
    id: "prime-keys-tkl",
    name: "Prime Keys TKL",
    brand: "Electro Prime",
    category: "accessories",
    price: 219,
    rating: 4.7,
    reviews: 862,
    image: keyboard,
    tagline: "CNC aluminium body, gasket-mounted silence.",
    colors: [
      { name: "Graphite", hex: "#2f3237" },
      { name: "Silver", hex: "#c5c9cf" },
    ],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "—",
      Display: "—",
      Battery: "120 hours",
      Ports: "USB-C, 2.4GHz dongle",
      Weight: "1.1 kg",
      Connectivity: "Bluetooth 5.3, 2.4GHz, wired",
    },
    featured: true,
  }),
  P({
    id: "vantage-strike-keys",
    name: "Vantage Strike Optical",
    brand: "Vantage",
    category: "gaming",
    price: 189,
    compareAt: 229,
    rating: 4.6,
    reviews: 521,
    image: keyboard,
    tagline: "Optical switches with 0.2 ms actuation.",
    colors: [{ name: "Obsidian", hex: "#16181c" }],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "—",
      Display: "—",
      Battery: "Wired",
      Ports: "USB-C, passthrough",
      Weight: "0.98 kg",
      Connectivity: "8000Hz polling",
    },
  }),
  P({
    id: "prime-glide-mx",
    name: "Prime Glide MX",
    brand: "Electro Prime",
    category: "accessories",
    price: 129,
    rating: 4.8,
    reviews: 1103,
    image: mouse,
    tagline: "8K sensor, 58 grams, silent actuation.",
    colors: [
      { name: "Graphite", hex: "#2f3237" },
      { name: "Bone", hex: "#e2ded6" },
    ],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "—",
      Display: "—",
      Battery: "90 hours",
      Ports: "USB-C",
      Weight: "58 g",
      Connectivity: "2.4GHz, Bluetooth 5.3",
    },
  }),
  P({
    id: "vantage-apex-mouse",
    name: "Vantage Apex Wireless",
    brand: "Vantage",
    category: "gaming",
    price: 159,
    rating: 4.7,
    reviews: 688,
    image: mouse,
    tagline: "44 g magnesium shell, 8000Hz wireless.",
    colors: [{ name: "Obsidian", hex: "#16181c" }],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "—",
      Display: "—",
      Battery: "110 hours",
      Ports: "USB-C",
      Weight: "44 g",
      Connectivity: "8000Hz 2.4GHz",
    },
  }),
  P({
    id: "prime-sound-one",
    name: "Prime Sound One",
    brand: "Electro Prime",
    category: "audio",
    price: 549,
    compareAt: 599,
    rating: 4.9,
    reviews: 1544,
    image: headphones,
    tagline: "Adaptive cancellation across 42 dB of noise floor.",
    colors: [
      { name: "Midnight", hex: "#22252b" },
      { name: "Steel", hex: "#9aa1a8" },
    ],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "—",
      Display: "—",
      Battery: "38 hours ANC",
      Ports: "USB-C, 3.5 mm",
      Weight: "268 g",
      Connectivity: "Bluetooth 5.4, LDAC, aptX Lossless",
    },
    featured: true,
  }),
  P({
    id: "prime-buds-pro",
    name: "Prime Buds Pro",
    brand: "Electro Prime",
    category: "audio",
    price: 249,
    rating: 4.7,
    reviews: 2210,
    image: earbuds,
    tagline: "Ceramic housings, adaptive transparency.",
    colors: [
      { name: "Bone", hex: "#eae7e1" },
      { name: "Graphite", hex: "#33363b" },
    ],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "—",
      Display: "—",
      Battery: "9 h + 32 h case",
      Ports: "USB-C, Qi2",
      Weight: "5.1 g each",
      Connectivity: "Bluetooth 5.4, LE Audio",
    },
  }),
  P({
    id: "vantage-headset-7",
    name: "Vantage Headset 7",
    brand: "Vantage",
    category: "gaming",
    price: 229,
    rating: 4.5,
    reviews: 430,
    image: headphones,
    tagline: "Planar drivers with a broadcast-grade boom.",
    colors: [{ name: "Obsidian", hex: "#16181c" }],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "—",
      Display: "—",
      Battery: "60 hours",
      Ports: "USB-C, 3.5 mm",
      Weight: "312 g",
      Connectivity: "2.4GHz, Bluetooth",
    },
  }),
  P({
    id: "prime-charge-140",
    name: "Prime Charge 140W",
    brand: "Electro Prime",
    category: "accessories",
    price: 89,
    rating: 4.6,
    reviews: 908,
    image: desktop,
    tagline: "GaN III in a 62 mm cube. Three ports.",
    colors: [{ name: "Bone", hex: "#eae7e1" }],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "—",
      Display: "—",
      Battery: "—",
      Ports: "2× USB-C, 1× USB-A",
      Weight: "196 g",
      Connectivity: "PD 3.1 / PPS",
    },
  }),
  P({
    id: "prime-reserve-20k",
    name: "Prime Reserve 20K",
    brand: "Electro Prime",
    category: "accessories",
    price: 119,
    compareAt: 139,
    rating: 4.5,
    reviews: 655,
    image: desktop,
    tagline: "20,000 mAh, 100W out, aluminium jacket.",
    colors: [{ name: "Graphite", hex: "#33363b" }],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "—",
      Display: "—",
      Battery: "20,000 mAh",
      Ports: "2× USB-C, 1× USB-A",
      Weight: "412 g",
      Connectivity: "PD 3.1, Qi2 pad",
    },
  }),
  P({
    id: "prime-link-cable",
    name: "Prime Link TB5 Cable",
    brand: "Electro Prime",
    category: "accessories",
    price: 59,
    rating: 4.4,
    reviews: 312,
    image: desktop,
    tagline: "120 Gb/s, braided, 1 m.",
    colors: [{ name: "Graphite", hex: "#33363b" }],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "—",
      Display: "—",
      Battery: "—",
      Ports: "USB-C to USB-C",
      Weight: "48 g",
      Connectivity: "Thunderbolt 5, 240W",
    },
  }),
  P({
    id: "prime-dock-pro",
    name: "Prime Dock Pro",
    brand: "Electro Prime",
    category: "computers",
    price: 329,
    rating: 4.6,
    reviews: 254,
    image: desktop,
    tagline: "Fourteen ports, one cable to the desk.",
    colors: [{ name: "Graphite", hex: "#33363b" }],
    specs: {
      CPU: "—",
      GPU: "—",
      RAM: "—",
      Storage: "—",
      Display: "Up to 3× 4K60",
      Battery: "—",
      Ports: "TB5 host, 4× USB-C, 4× USB-A, 2.5GbE, SD",
      Weight: "680 g",
      Connectivity: "Thunderbolt 5",
    },
  }),
  P({
    id: "prime-pad-11",
    name: "Prime Pad 11",
    brand: "Electro Prime",
    category: "tablets",
    price: 699,
    rating: 4.6,
    reviews: 390,
    image: tablet,
    tagline: "The everyday slab, now with 120Hz.",
    colors: [
      { name: "Silver", hex: "#c8ccd2" },
      { name: "Slate", hex: "#4a4e55" },
    ],
    storage: ["128GB", "256GB", "512GB"],
    specs: {
      CPU: "Prime M3",
      GPU: "8-core",
      RAM: "8GB",
      Storage: "128GB–512GB",
      Display: '11" 2420×1668 IPS, 120Hz',
      Battery: "12 hours",
      Ports: "USB-C",
      Weight: "462 g",
      Connectivity: "Wi-Fi 6E",
    },
  }),
];

export const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const byCategory = (slug: CategorySlug) => products.filter((p) => p.category === slug);

export const searchProducts = (q: string) => {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const terms = query.split(/\s+/);
  return products
    .map((p) => {
      const haystack = [
        p.name,
        p.brand,
        p.category,
        p.tagline,
        ...(p.storage ?? []),
        ...(p.memory ?? []),
        ...Object.values(p.specs),
      ]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce((acc, t) => acc + (haystack.includes(t) ? 1 : 0), 0);
      return { p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((r) => r.p);
};
