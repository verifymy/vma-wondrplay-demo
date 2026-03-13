"use client";

import { useState } from "react";
import {
  Settings,
  FileText,
  Copy,
  Check,
} from "lucide-react";
import type { VerifyResponse, VerificationType, Region } from "@/lib/types";
import { REGION_LABELS } from "@/lib/types";
import {
  flattenForDisplay,
  getNestedValue,
} from "@/lib/result-formatters";

const TYPE_LABELS: Record<VerificationType, string> = {
  identityGraph: "Identity graph",
  ageVerifyMno: "Age verify (MNO)",
  reverseLookup: "Reverse lookup",
};

interface Props {
  result: VerifyResponse;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 inline-flex items-center text-brand-400 hover:text-brand-600 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-accent-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function ResultBadge({ value }: { value: string }) {
  const isYes =
    value === "true" || value === "Yes" || value === "yes" || value === "True";
  const isNo =
    value === "false" || value === "No" || value === "no" || value === "False";

  if (isYes) {
    return (
      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 border border-green-200">
        Yes
      </span>
    );
  }
  if (isNo) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 border border-red-200">
        No
      </span>
    );
  }
  return null;
}

export function ResultsPanel({ result }: Props) {
  const items = flattenForDisplay(result.raw);

  // Determine method label
  const methodLabel =
    result.inputType === "email" ? "Email address" : "Phone number";

  // Determine region label for display
  const regionLabel = result.region
    ? REGION_LABELS[result.region as Region]
    : undefined;

  // Extract country code from API response for Age Verify MNO
  const countryCode =
    result.verificationType === "ageVerifyMno"
      ? ((getNestedValue(result.raw, "countrycode") ??
          getNestedValue(result.raw, "countryCode")) as
          | string
          | number
          | undefined)
      : undefined;

  return (
    <div className="space-y-4">
      {/* Two-column cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Configuration card */}
        <div className="rounded-xl border border-brand-100 bg-white overflow-hidden">
          <div className="flex items-center gap-2 border-b border-brand-100 px-5 py-3">
            <Settings className="w-4 h-4 text-accent-600" />
            <h3 className="text-sm font-semibold text-brand-900">
              Configuration
            </h3>
          </div>
          <div className="px-5 py-4">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-brand-50">
                <tr>
                  <td className="py-2 pr-4 text-brand-500 font-medium">
                    Type
                  </td>
                  <td className="py-2 text-brand-900 font-semibold">
                    {TYPE_LABELS[result.verificationType]}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-brand-500 font-medium">
                    Method
                  </td>
                  <td className="py-2 text-brand-900 font-semibold">
                    {methodLabel}
                  </td>
                </tr>
                {regionLabel && (
                  <tr>
                    <td className="py-2 pr-4 text-brand-500 font-medium">
                      Region
                    </td>
                    <td className="py-2 text-brand-900 font-semibold">
                      {result.region}
                    </td>
                  </tr>
                )}
                {countryCode != null && (
                  <tr>
                    <td className="py-2 pr-4 text-brand-500 font-medium">
                      Country code
                    </td>
                    <td className="py-2 text-brand-900 font-semibold">
                      {String(countryCode)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="py-2 pr-4 text-brand-500 font-medium">
                    Input value
                  </td>
                  <td className="py-2 text-brand-900 font-semibold">
                    {result.inputValue}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed verification card */}
        <div className="rounded-xl border border-brand-100 bg-white overflow-hidden">
          <div className="flex items-center gap-2 border-b border-brand-100 px-5 py-3">
            <FileText className="w-4 h-4 text-accent-600" />
            <h3 className="text-sm font-semibold text-brand-900">
              Detailed verification
            </h3>
          </div>
          <div className="px-5 py-4 max-h-80 overflow-auto">
            {items.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-brand-100">
                    <th className="pb-2 text-xs font-medium text-brand-400">
                      Attribute
                    </th>
                    <th className="pb-2 text-xs font-medium text-brand-400">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {items.map((item) => {
                    const badge = ResultBadge({ value: item.value });
                    const isIdField =
                      item.key.toLowerCase().includes("requestid") ||
                      item.key.toLowerCase().includes("instanceid") ||
                      item.key.toLowerCase().includes("instantid");
                    return (
                      <tr key={item.key}>
                        <td className="py-2 pr-4 text-brand-500">
                          {item.label}
                        </td>
                        <td className="py-2 text-brand-900">
                          {badge || (
                            <span
                              className={`inline-flex items-center ${
                                item.value.length > 30
                                  ? "text-xs font-mono"
                                  : ""
                              }`}
                            >
                              <span
                                className={
                                  isIdField
                                    ? "truncate max-w-[200px]"
                                    : undefined
                                }
                              >
                                {item.value}
                              </span>
                              {isIdField && (
                                <CopyButton text={item.value} />
                              )}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-brand-400">
                No detailed data available
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
