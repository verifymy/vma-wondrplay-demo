"use client";

import { User, Phone, Mail, MapPin, AlertTriangle } from "lucide-react";
import { ResultCard } from "./ResultCard";
import { RiskBadge, inferRiskLevel } from "./RiskBadge";
import { flattenForDisplay, formatValue, getNestedValue } from "@/lib/result-formatters";

interface Props {
  data: Record<string, unknown>;
}

export function ResultsIdentityGraph({ data }: Props) {
  // Try common response patterns
  const riskScore = getNestedValue(data, "riskScore") ?? getNestedValue(data, "risk_score");
  const identity = getNestedValue(data, "identity") as Record<string, unknown> | undefined;
  const status = getNestedValue(data, "status");
  const message = getNestedValue(data, "message");

  // If there's an error or message at top level
  if (status === "error" || (message && !identity)) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-amber-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">
            {formatValue(message) || "No data returned"}
          </span>
        </div>
        <GenericDisplay data={data} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Risk Score */}
      {riskScore !== undefined && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-brand-700">
            Risk Assessment:
          </span>
          <RiskBadge level={inferRiskLevel(riskScore as number)} />
          <span className="text-sm text-brand-500">
            Score: {formatValue(riskScore)}
          </span>
        </div>
      )}

      {/* Identity details */}
      {identity ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {"name" in identity && (
            <ResultCard
              label="Name"
              value={formatValue(identity.name)}
              icon={<User className="h-4 w-4" />}
            />
          )}
          {"phone" in identity && (
            <ResultCard
              label="Phone"
              value={formatValue(identity.phone)}
              icon={<Phone className="h-4 w-4" />}
            />
          )}
          {"email" in identity && (
            <ResultCard
              label="Email"
              value={formatValue(identity.email)}
              icon={<Mail className="h-4 w-4" />}
            />
          )}
          {"address" in identity && (
            <ResultCard
              label="Address"
              value={formatValue(identity.address)}
              icon={<MapPin className="h-4 w-4" />}
            />
          )}
        </div>
      ) : (
        <GenericDisplay data={data} />
      )}
    </div>
  );
}

function GenericDisplay({ data }: { data: Record<string, unknown> }) {
  const items = flattenForDisplay(data);
  if (items.length === 0) {
    return <p className="text-sm text-brand-400">No data returned</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <ResultCard key={item.key} label={item.label} value={item.value} />
      ))}
    </div>
  );
}
