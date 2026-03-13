"use client";

import { type Brand, BRANDS } from "@/lib/brand";

interface BrandToggleProps {
  brand: Brand;
  onBrandChange: (brand: Brand) => void;
}

const BRAND_LIST = Object.values(BRANDS);

export function BrandToggle({ brand, onBrandChange }: BrandToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-brand-50 p-1">
      {BRAND_LIST.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onBrandChange(id)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            brand === id
              ? "bg-accent-500 text-white"
              : "text-brand-400 hover:text-brand-700 hover:bg-brand-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
