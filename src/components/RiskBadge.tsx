"use client";

type RiskLevel = "low" | "medium" | "high" | "unknown";

const STYLES: Record<RiskLevel, string> = {
  low: "bg-green-50 text-green-700 border-green-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50 text-red-700 border-red-200",
  unknown: "bg-slate-50 text-slate-600 border-slate-200",
};

const LABELS: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
  unknown: "Unknown",
};

interface Props {
  level: RiskLevel;
  label?: string;
}

export function RiskBadge({ level, label }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[level]}`}
    >
      {label || LABELS[level]}
    </span>
  );
}

export function inferRiskLevel(score: number | string | undefined): RiskLevel {
  if (score === undefined || score === null) return "unknown";
  const num = typeof score === "string" ? parseFloat(score) : score;
  if (isNaN(num)) return "unknown";
  if (num <= 30) return "low";
  if (num <= 70) return "medium";
  return "high";
}
