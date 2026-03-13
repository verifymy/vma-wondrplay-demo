"use client";

import { REGION_FLAGS, REGION_PHONE_PREFIXES, type Region } from "@/lib/types";

interface Props {
  value: string;
  onChange: (value: string) => void;
  region?: Region;
  showPrefix: boolean;
  placeholder?: string;
}

export function PhoneInput({
  value,
  onChange,
  region,
  showPrefix,
  placeholder,
}: Props) {
  const prefix = region && showPrefix ? REGION_PHONE_PREFIXES[region] : "";
  const flag = region && showPrefix ? REGION_FLAGS[region] : "";

  return (
    <div className="flex">
      {showPrefix && prefix && (
        <div className="flex items-center gap-1.5 rounded-l-lg border border-r-0 border-brand-200 bg-brand-50 px-3 text-sm text-brand-600">
          <span>{flag}</span>
          <span className="font-mono">{prefix}</span>
        </div>
      )}
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter phone number"}
        className={`w-full border border-brand-200 bg-white px-4 py-2.5 text-sm text-brand-900 placeholder:text-brand-300 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 ${
          showPrefix && prefix ? "rounded-r-lg" : "rounded-lg"
        }`}
      />
    </div>
  );
}
