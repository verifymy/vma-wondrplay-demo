"use client";

import {
  ShieldCheck,
  ShieldX,
  Phone,
  Globe,
  Radio,
  AlertTriangle,
} from "lucide-react";
import { ResultCard } from "./ResultCard";
import { flattenForDisplay, formatValue, getNestedValue } from "@/lib/result-formatters";

interface Props {
  data: Record<string, unknown>;
}

export function ResultsAgeVerify({ data }: Props) {
  const status = getNestedValue(data, "status");
  const message = getNestedValue(data, "message");

  // Error state
  if (status === "error" || (message && !getNestedValue(data, "success"))) {
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

  // Try to extract from the nested MNO response structure
  const results = data.results as unknown[] | undefined;
  const firstResult =
    results && results.length > 0
      ? (results[0] as Record<string, unknown>)
      : undefined;
  const contacts = firstResult?.contacts as unknown[] | undefined;
  const firstContact =
    contacts && contacts.length > 0
      ? (contacts[0] as Record<string, unknown>)
      : undefined;
  const niResults = firstContact?.nicheckresults as Record<string, unknown> | undefined;
  const ageVerify = niResults?.ageVerify as Record<string, unknown> | undefined;

  // Extract key values
  const isAgeVerified =
    ageVerify?.is_age_verified ??
    getNestedValue(data, "is_age_verified") ??
    data.ageVerified;
  const msisdn = ageVerify?.msisdn as string | undefined;
  const mccmnc = ageVerify?.mccmnc as string | undefined;
  const ageMessage = ageVerify?.Message as string | undefined;
  const countryCode = niResults?.countrycode as string | undefined;
  const phone = (
    getNestedValue(data, "results") as Array<Record<string, unknown>> | undefined
  )?.[0]?.input
    ? getNestedValue(
        (results![0] as Record<string, unknown>).input as Record<string, unknown>,
        "contacts"
      )
    : undefined;
  const inputPhone =
    phone && Array.isArray(phone) && phone.length > 0
      ? (phone[0] as Record<string, unknown>).phone
      : undefined;

  const verified =
    isAgeVerified === true || isAgeVerified === "true";
  const hasVerificationResult = isAgeVerified !== undefined && isAgeVerified !== null;

  return (
    <div className="space-y-4">
      {/* Hero verification result */}
      {hasVerificationResult && (
        <div
          className={`flex items-center gap-3 rounded-lg border p-4 ${
            verified
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          {verified ? (
            <ShieldCheck className="h-6 w-6 text-green-600" />
          ) : (
            <ShieldX className="h-6 w-6 text-red-600" />
          )}
          <div>
            <p
              className={`font-semibold ${
                verified ? "text-green-800" : "text-red-800"
              }`}
            >
              {verified ? "Age Verified" : "Age Not Verified"}
            </p>
            <p
              className={`text-xs ${
                verified ? "text-green-600" : "text-red-600"
              }`}
            >
              Via Mobile Network Operator
              {ageMessage ? ` \u2014 ${ageMessage}` : ""}
            </p>
          </div>
        </div>
      )}

      {/* Key details */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {inputPhone !== undefined && inputPhone !== null && (
          <ResultCard
            label="Phone Number"
            value={formatValue(inputPhone)}
            icon={<Phone className="h-4 w-4" />}
          />
        )}
        {msisdn && (
          <ResultCard
            label="MSISDN"
            value={msisdn}
            icon={<Phone className="h-4 w-4" />}
          />
        )}
        {countryCode && (
          <ResultCard
            label="Country Code"
            value={countryCode}
            icon={<Globe className="h-4 w-4" />}
          />
        )}
        {mccmnc && (
          <ResultCard
            label="MCC/MNC (Carrier)"
            value={mccmnc}
            icon={<Radio className="h-4 w-4" />}
          />
        )}
      </div>

      {/* Usage stats */}
      {data.consumedtotal !== undefined && (
        <div>
          <p className="mb-2 text-xs font-medium text-brand-500">
            API Usage
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ResultCard
              label="Used This Call"
              value={formatValue(data.consumedthiscall)}
            />
            <ResultCard
              label="Total Used"
              value={formatValue(data.consumedtotal)}
            />
            <ResultCard
              label="Remaining"
              value={formatValue(data.remaining)}
            />
            <ResultCard
              label="Limit"
              value={`${formatValue(data.periodlimit)} / ${formatValue(data.period)}`}
            />
          </div>
        </div>
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
