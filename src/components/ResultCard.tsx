"use client";

import { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}

export function ResultCard({ label, value, icon }: Props) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-brand-100 bg-brand-50/50 px-4 py-3">
      {icon && <div className="mt-0.5 text-brand-400">{icon}</div>}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-wide text-brand-400">
          {label}
        </p>
        <div className="mt-0.5 text-sm font-medium text-brand-900">
          {value ?? <span className="text-brand-300">N/A</span>}
        </div>
      </div>
    </div>
  );
}
