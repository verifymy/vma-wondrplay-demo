"use client";

import type { VerificationTypeInfo } from "@/lib/types";

interface Props {
  info: VerificationTypeInfo;
  selected: boolean;
  onSelect: () => void;
}

export function VerificationTypeCard({ info, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex flex-col items-start gap-3 rounded-xl border p-5 text-left transition-colors ${
        selected
          ? "border-accent-500 bg-white shadow-sm"
          : "border-brand-100 bg-brand-50/50 hover:border-brand-200"
      }`}
    >
      <div>
        <p className="font-semibold text-brand-900">{info.label}</p>
        <p className="mt-1 text-xs text-brand-500 leading-relaxed">
          {info.description}
        </p>
      </div>
      {/* Radio indicator */}
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected ? "border-accent-500" : "border-brand-300"
        }`}
      >
        {selected && (
          <div className="w-2.5 h-2.5 rounded-full bg-accent-500" />
        )}
      </div>
    </button>
  );
}
