import imgTomatoes from "@/assets/products/tomatoes.jpg";
import imgMilk from "@/assets/products/milk.jpg";
import imgChips from "@/assets/products/chips.jpg";
import imgRice from "@/assets/products/rice.jpg";
import imgPaneer from "@/assets/products/paneer.jpg";
import imgCookingOil from "@/assets/products/cooking-oil.jpg";
import imgBananas from "@/assets/products/bananas.jpg";
import imgCurd from "@/assets/products/curd.jpg";
import imgWheatFlour from "@/assets/products/wheat-flour.jpg";
import imgSugar from "@/assets/products/sugar.jpg";
import imgJaggery from "@/assets/products/jaggery.jpg";
import imgIdliBatter from "@/assets/products/idli-batter.jpg";
import imgPickle from "@/assets/products/pickle.jpg";

// Unsplash CDN — fast, royalty-free product imagery for new categories.
// Using `?w=400&q=75&auto=format` keeps payload small.
const u = (id: string) => `https://images.unsplash.com/${id}?w=400&q=75&auto=format&fit=crop`;

export type Category =
  | "Vegetables"
  | "Fruits"
  | "Dairy"
  | "Snacks"
  | "Essentials"
  | "Bakery"
  | "Beverages"
  | "Specials"
  | "Fashion"
  | "Pharmacy"
  | "Electronics"
  | "Home"
  | "Personal Care";

export const CATEGORIES: Category[] = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Snacks",
  "Essentials",
  "Bakery",
  "Beverages",
  "Specials",
  "Fashion",
  "Pharmacy",
  "Electronics",
  "Home",
  "Personal Care",
];

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  seller: string;
  sellerId: string;
  image: string;
  description: string;
  tag?: string;
  category: Category;
};

// Discount = originalPrice present and > price
export const PRODUCTS: Product[] = [
  { id: "p1", category: "Vegetables", name: "Fresh Tomatoes", price: 20, originalPrice: 28, unit: "1 kg", seller: "Priya Fresh Mart", sellerId: "s2", image: imgTomatoes, description: "Hand-picked vine-ripened tomatoes from local farms. Sourced this morning.", tag: "🔥 Hot" },
  { id: "p2", category: "Dairy", name: "Whole Milk", price: 30, unit: "500 ml", seller: "Lakshmi Dairy", sellerId: "s4", image: imgMilk, description: "Fresh full-cream milk from grass-fed cows. Pasteurized daily." },
  { id: "p3", category: "Snacks", name: "Masala Chips", price: 10, originalPrice: 15, unit: "Pack", seller: "Ravi General Store", sellerId: "s1", image: imgChips, description: "Crispy spiced potato chips, locally produced.", tag: "⚡ Fast" },
  { id: "p4", category: "Essentials", name: "Basmati Rice", price: 85, originalPrice: 110, unit: "1 kg", seller: "Kumar Groceries", sellerId: "s3", image: imgRice, description: "Premium long-grain basmati rice. Aged for perfect aroma." },
  { id: "p5", category: "Dairy", name: "Fresh Paneer", price: 90, unit: "200g", seller: "Lakshmi Dairy", sellerId: "s4", image: imgPaneer, description: "Soft cottage cheese made fresh today from whole milk.", tag: "🔥 Hot" },
  { id: "p6", category: "Essentials", name: "Cooking Oil", price: 180, originalPrice: 210, unit: "1 L", seller: "Ravi General Store", sellerId: "s1", image: imgCookingOil, description: "Cold-pressed sunflower oil. Pure & unrefined." },
  { id: "p7", category: "Fruits", name: "Bananas", price: 40, unit: "6 pcs", seller: "Priya Fresh Mart", sellerId: "s2", image: imgBananas, description: "Ripe yellow bananas, perfect sweetness.", tag: "⚡ Fast" },
  { id: "p8", category: "Dairy", name: "Curd", price: 25, originalPrice: 35, unit: "400g", seller: "Lakshmi Dairy", sellerId: "s4", image: imgCurd, description: "Thick homestyle curd, set fresh every morning." },
  { id: "p9", category: "Essentials", name: "Wheat Flour", price: 48, unit: "1 kg", seller: "Ahmed Provisions", sellerId: "s5", image: imgWheatFlour, description: "Stone-ground whole wheat flour. High fiber." },
  { id: "p10", category: "Essentials", name: "Sugar", price: 45, unit: "1 kg", seller: "Kumar Groceries", sellerId: "s3", image: imgSugar, description: "Refined white sugar, food grade." },
  { id: "p11", category: "Specials", name: "Organic Jaggery", price: 65, originalPrice: 80, unit: "500g", seller: "Priya Fresh Mart", sellerId: "s2", image: imgJaggery, description: "Traditional unrefined jaggery from local farms. Rich in iron.", tag: "Local Favorite" },
  { id: "p12", category: "Specials", name: "Fresh Idli Batter", price: 40, unit: "1 L", seller: "Lakshmi Dairy", sellerId: "s4", image: imgIdliBatter, description: "Fermented rice & urad dal batter. Made today.", tag: "Made Today" },
  { id: "p13", category: "Specials", name: "Pickle (Mango)", price: 120, originalPrice: 150, unit: "250g", seller: "Kumar Groceries", sellerId: "s3", image: imgPickle, description: "Spicy mango pickle, homemade traditional recipe.", tag: "Homemade" },

  // 🍞 Bakery — new dedicated bakery store "Sweet Crumb Bakers"
  { id: "p14", category: "Bakery", name: "Fresh Sourdough Loaf", price: 90, originalPrice: 120, unit: "400g", seller: "Sweet Crumb Bakers", sellerId: "s6", image: u("photo-1509440159596-0249088772ff"), description: "Naturally leavened sourdough, baked fresh every morning.", tag: "🔥 Hot" },
  { id: "p15", category: "Bakery", name: "Chocolate Croissant", price: 60, unit: "1 pc", seller: "Sweet Crumb Bakers", sellerId: "s6", image: u("photo-1623334044303-241021148842"), description: "Buttery laminated dough with rich Belgian chocolate." },
  { id: "p16", category: "Bakery", name: "Red Velvet Cake", price: 450, originalPrice: 550, unit: "500g", seller: "Sweet Crumb Bakers", sellerId: "s6", image: u("photo-1586985289688-ca3cf47d3e6e"), description: "Moist red velvet with cream cheese frosting.", tag: "Made Today" },
  { id: "p17", category: "Bakery", name: "Garlic Bread", price: 80, unit: "Pack of 4", seller: "Sweet Crumb Bakers", sellerId: "s6", image: u("photo-1573140247632-f8fd74997d5c"), description: "Crusty bread with herbed garlic butter." },

  // 💊 Pharmacy — "MediCare Plus"
  { id: "p18", category: "Pharmacy", name: "Paracetamol 500mg", price: 25, unit: "Strip of 10", seller: "MediCare Plus", sellerId: "s7", image: u("photo-1584308666744-24d5c474f2ae"), description: "Fever and pain relief. Otc, Schedule H not required." },
  { id: "p19", category: "Pharmacy", name: "Vitamin C Tablets", price: 180, originalPrice: 220, unit: "60 tabs", seller: "MediCare Plus", sellerId: "s7", image: u("photo-1550572017-edd951b55104"), description: "Immunity boost — 1000mg chewable tablets.", tag: "⚡ Fast" },
  { id: "p20", category: "Pharmacy", name: "Hand Sanitizer", price: 65, unit: "200 ml", seller: "MediCare Plus", sellerId: "s7", image: u("photo-1584744982491-665216d95f8b"), description: "70% alcohol sanitizer with aloe vera." },
  { id: "p21", category: "Pharmacy", name: "Digital Thermometer", price: 220, originalPrice: 280, unit: "1 unit", seller: "MediCare Plus", sellerId: "s7", image: u("photo-1631549916768-4119b2e5f926"), description: "Fast-read digital thermometer with fever alert." },

  // 👕 Fashion — "Threadline Studio"
  { id: "p22", category: "Fashion", name: "Cotton T-Shirt", price: 399, originalPrice: 599, unit: "1 pc", seller: "Threadline Studio", sellerId: "s8", image: u("photo-1521572163474-6864f9cf17ab"), description: "100% organic cotton, regular fit. Multiple colors.", tag: "Trending" },
  { id: "p23", category: "Fashion", name: "Slim Fit Jeans", price: 1299, originalPrice: 1899, unit: "1 pc", seller: "Threadline Studio", sellerId: "s8", image: u("photo-1542272604-787c3835535d"), description: "Stretch denim, comfortable everyday wear." },
  { id: "p24", category: "Fashion", name: "Canvas Sneakers", price: 899, unit: "1 pair", seller: "Threadline Studio", sellerId: "s8", image: u("photo-1542291026-7eec264c27ff"), description: "Classic low-top sneakers with rubber sole.", tag: "🔥 Hot" },
  { id: "p25", category: "Fashion", name: "Silk Kurta", price: 1499, originalPrice: 2200, unit: "1 pc", seller: "Threadline Studio", sellerId: "s8", image: u("photo-1610030469983-98e550d6193c"), description: "Hand-loomed silk kurta, festive collection." },

  // 📱 Electronics — "TechHub Express"
  { id: "p26", category: "Electronics", name: "Wireless Earbuds", price: 1499, originalPrice: 2499, unit: "1 pair", seller: "TechHub Express", sellerId: "s9", image: u("photo-1606220945770-b5b6c2c55bf1"), description: "Bluetooth 5.3, 24hr battery, IPX4 water resistance.", tag: "🔥 Hot" },
  { id: "p27", category: "Electronics", name: "Fast Charger 25W", price: 599, originalPrice: 899, unit: "1 unit", seller: "TechHub Express", sellerId: "s9", image: u("photo-1583863788434-e58a36330cf0"), description: "USB-C PD fast charger with cable." },
  { id: "p28", category: "Electronics", name: "Phone Stand", price: 249, unit: "1 unit", seller: "TechHub Express", sellerId: "s9", image: u("photo-1601784551446-20c9e07cdbdb"), description: "Adjustable aluminum desktop phone stand." },
  { id: "p29", category: "Electronics", name: "Power Bank 10000mAh", price: 999, originalPrice: 1499, unit: "1 unit", seller: "TechHub Express", sellerId: "s9", image: u("photo-1609091839311-d5365f9ff1c5"), description: "Dual USB ports, 22.5W fast charging." },

  // 🏠 Home & Kitchen — "HomeStyle Bazaar"
  { id: "p30", category: "Home", name: "Steel Water Bottle", price: 449, originalPrice: 699, unit: "750 ml", seller: "HomeStyle Bazaar", sellerId: "s10", image: u("photo-1602143407151-7111542de6e8"), description: "Insulated stainless steel — keeps drinks hot/cold for 24hrs." },
  { id: "p31", category: "Home", name: "Bedsheet Set", price: 899, originalPrice: 1299, unit: "Queen size", seller: "HomeStyle Bazaar", sellerId: "s10", image: u("photo-1522771739844-6a9f6d5f14af"), description: "200TC cotton bedsheet with 2 pillow covers.", tag: "⚡ Fast" },
  { id: "p32", category: "Home", name: "Non-stick Pan", price: 599, unit: "26 cm", seller: "HomeStyle Bazaar", sellerId: "s10", image: u("photo-1584990347449-a5d9f800a783"), description: "PFOA-free non-stick frying pan with bakelite handle." },
  { id: "p33", category: "Home", name: "Scented Candle", price: 349, originalPrice: 449, unit: "200g", seller: "HomeStyle Bazaar", sellerId: "s10", image: u("photo-1602874801007-bd458bb1b8b6"), description: "Soy wax candle with lavender essential oil. 40hr burn." },

  // 🧴 Personal Care — "GlowKart"
  { id: "p34", category: "Personal Care", name: "Face Wash", price: 199, originalPrice: 249, unit: "100 ml", seller: "GlowKart", sellerId: "s11", image: u("photo-1556228720-195a672e8a03"), description: "Vitamin C brightening face wash. Sulfate-free." },
  { id: "p35", category: "Personal Care", name: "Shampoo", price: 299, unit: "340 ml", seller: "GlowKart", sellerId: "s11", image: u("photo-1631730486572-226d1f595b68"), description: "Anti-dandruff shampoo with tea tree oil." },
  { id: "p36", category: "Personal Care", name: "Sunscreen SPF 50", price: 499, originalPrice: 649, unit: "50 g", seller: "GlowKart", sellerId: "s11", image: u("photo-1556228578-8c89e6adf883"), description: "Broad-spectrum mineral sunscreen, non-greasy.", tag: "🔥 Hot" },
  { id: "p37", category: "Personal Care", name: "Body Lotion", price: 349, unit: "250 ml", seller: "GlowKart", sellerId: "s11", image: u("photo-1570194065650-d99fb4bedf0a"), description: "Deep moisturizing shea butter body lotion." },

  // 🥤 Beverages — small extension
  { id: "p38", category: "Beverages", name: "Cold Brew Coffee", price: 120, unit: "300 ml", seller: "Sweet Crumb Bakers", sellerId: "s6", image: u("photo-1517701604599-bb29b565090c"), description: "Smooth cold-brewed Arabica coffee.", tag: "Cold" },
  { id: "p39", category: "Beverages", name: "Fresh Lime Soda", price: 60, unit: "350 ml", seller: "Ravi General Store", sellerId: "s1", image: u("photo-1556679343-c7306c1976bc"), description: "Refreshing tangy lime soda." },
];

export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id);

export const discountPct = (p: Pick<Product, "price" | "originalPrice">) =>
  p.originalPrice && p.originalPrice > p.price
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : 0;

// Helper for category visuals on Home/Explore screens
export const CATEGORY_META: Record<Category, { label: string; labelClass: string; image: string }> = {
  Vegetables: { label: "Fresh", labelClass: "bg-emerald-500", image: u("photo-1518977676601-b53f82aba655") },
  Fruits: { label: "Daily", labelClass: "bg-orange-500", image: u("photo-1610832958506-aa56368176cf") },
  Dairy: { label: "Daily", labelClass: "bg-blue-500", image: u("photo-1628088062854-d1870b4553da") },
  Snacks: { label: "Quick", labelClass: "bg-amber-500", image: u("photo-1621447504864-d8686e12698c") },
  Essentials: { label: "10 min", labelClass: "bg-violet-500", image: u("photo-1604908176997-125f25cc6f3d") },
  Bakery: { label: "Hot", labelClass: "bg-rose-500", image: u("photo-1509440159596-0249088772ff") },
  Beverages: { label: "Cold", labelClass: "bg-cyan-500", image: u("photo-1517701604599-bb29b565090c") },
  Specials: { label: "Local", labelClass: "bg-fuchsia-500", image: u("photo-1565299624946-b28f40a0ae38") },
  Fashion: { label: "Style", labelClass: "bg-pink-500", image: u("photo-1483985988355-763728e1935b") },
  Pharmacy: { label: "24x7", labelClass: "bg-red-500", image: u("photo-1576602976047-174e57a47881") },
  Electronics: { label: "New", labelClass: "bg-indigo-500", image: u("photo-1498049794561-7780e7231661") },
  Home: { label: "Cozy", labelClass: "bg-teal-500", image: u("photo-1556909114-f6e7ad7d3136") },
  "Personal Care": { label: "Glow", labelClass: "bg-fuchsia-400", image: u("photo-1556228453-efd6c1ff04f6") },
};
