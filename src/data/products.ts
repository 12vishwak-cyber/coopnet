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
};

// Discount = originalPrice present and > price
export const PRODUCTS: Product[] = [
  { id: "p1", name: "Fresh Tomatoes", price: 20, originalPrice: 28, unit: "1 kg", seller: "Priya Fresh Mart", sellerId: "s2", image: imgTomatoes, description: "Hand-picked vine-ripened tomatoes from local farms. Sourced this morning.", tag: "🔥 Hot" },
  { id: "p2", name: "Whole Milk", price: 30, unit: "500 ml", seller: "Lakshmi Dairy", sellerId: "s4", image: imgMilk, description: "Fresh full-cream milk from grass-fed cows. Pasteurized daily." },
  { id: "p3", name: "Masala Chips", price: 10, originalPrice: 15, unit: "Pack", seller: "Ravi General Store", sellerId: "s1", image: imgChips, description: "Crispy spiced potato chips, locally produced.", tag: "⚡ Fast" },
  { id: "p4", name: "Basmati Rice", price: 85, originalPrice: 110, unit: "1 kg", seller: "Kumar Groceries", sellerId: "s3", image: imgRice, description: "Premium long-grain basmati rice. Aged for perfect aroma." },
  { id: "p5", name: "Fresh Paneer", price: 90, unit: "200g", seller: "Lakshmi Dairy", sellerId: "s4", image: imgPaneer, description: "Soft cottage cheese made fresh today from whole milk.", tag: "🔥 Hot" },
  { id: "p6", name: "Cooking Oil", price: 180, originalPrice: 210, unit: "1 L", seller: "Ravi General Store", sellerId: "s1", image: imgCookingOil, description: "Cold-pressed sunflower oil. Pure & unrefined." },
  { id: "p7", name: "Bananas", price: 40, unit: "6 pcs", seller: "Priya Fresh Mart", sellerId: "s2", image: imgBananas, description: "Ripe yellow bananas, perfect sweetness.", tag: "⚡ Fast" },
  { id: "p8", name: "Curd", price: 25, originalPrice: 35, unit: "400g", seller: "Lakshmi Dairy", sellerId: "s4", image: imgCurd, description: "Thick homestyle curd, set fresh every morning." },
  { id: "p9", name: "Wheat Flour", price: 48, unit: "1 kg", seller: "Ahmed Provisions", sellerId: "s5", image: imgWheatFlour, description: "Stone-ground whole wheat flour. High fiber." },
  { id: "p10", name: "Sugar", price: 45, unit: "1 kg", seller: "Kumar Groceries", sellerId: "s3", image: imgSugar, description: "Refined white sugar, food grade." },
  { id: "p11", name: "Organic Jaggery", price: 65, originalPrice: 80, unit: "500g", seller: "Priya Fresh Mart", sellerId: "s2", image: imgJaggery, description: "Traditional unrefined jaggery from local farms. Rich in iron.", tag: "Local Favorite" },
  { id: "p12", name: "Fresh Idli Batter", price: 40, unit: "1 L", seller: "Lakshmi Dairy", sellerId: "s4", image: imgIdliBatter, description: "Fermented rice & urad dal batter. Made today.", tag: "Made Today" },
  { id: "p13", name: "Pickle (Mango)", price: 120, originalPrice: 150, unit: "250g", seller: "Kumar Groceries", sellerId: "s3", image: imgPickle, description: "Spicy mango pickle, homemade traditional recipe.", tag: "Homemade" },
];

export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id);

export const discountPct = (p: Pick<Product, "price" | "originalPrice">) =>
  p.originalPrice && p.originalPrice > p.price
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : 0;
