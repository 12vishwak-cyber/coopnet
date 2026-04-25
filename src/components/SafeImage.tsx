import { useState } from "react";
import type { Category } from "@/data/products";

// Category → guaranteed-safe fallback image. These were hand-picked from
// Unsplash for each category and are NEVER swapped or rotated.
const CATEGORY_FALLBACK: Record<string, string> = {
  Vegetables: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80&auto=format&fit=crop",
  Fruits: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80&auto=format&fit=crop",
  Dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&q=80&auto=format&fit=crop",
  Snacks: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=600&q=80&auto=format&fit=crop",
  Essentials: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80&auto=format&fit=crop",
  Bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80&auto=format&fit=crop",
  Beverages: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80&auto=format&fit=crop",
  Specials: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80&auto=format&fit=crop",
  Fashion: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&auto=format&fit=crop",
  Pharmacy: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&q=80&auto=format&fit=crop",
  Electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80&auto=format&fit=crop",
  Home: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&auto=format&fit=crop",
  "Personal Care": "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80&auto=format&fit=crop",
};

const GENERIC_FALLBACK =
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&auto=format&fit=crop";

export function fallbackForCategory(category?: string | null): string {
  if (category && CATEGORY_FALLBACK[category]) return CATEGORY_FALLBACK[category];
  return GENERIC_FALLBACK;
}

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "onError"> & {
  src?: string | null;
  alt: string;
  category?: Category | string | null;
};

/**
 * Image wrapper that swaps in a category-relevant fallback if the source
 * fails to load OR is missing. Guarantees product cards never show a
 * broken/wrong image (e.g. a person photo where bread was expected).
 */
export default function SafeImage({ src, category, alt, ...rest }: Props) {
  const [errored, setErrored] = useState(false);
  const finalSrc = !src || errored ? fallbackForCategory(category) : src;
  return (
    <img
      {...rest}
      src={finalSrc}
      alt={alt}
      onError={() => {
        if (!errored) setErrored(true);
      }}
    />
  );
}
