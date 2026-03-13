/**
 * Safely get a nested value from an object using a dot-separated path.
 */
export function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Format a value for display.
 */
export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") return value || "N/A";
  if (Array.isArray(value)) return value.join(", ") || "N/A";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * Known key mappings for better display labels.
 */
const KEY_LABELS: Record<string, string> = {
  generatedat: "Generated At",
  generatedAt: "Generated At",
  consumedthiscall: "Consumed This Call",
  consumedtotal: "Consumed Total",
  periodlimit: "Period Limit",
  requestid: "Request ID",
  requestId: "Request ID",
  instanceid: "Instance ID",
  instanceId: "Instance ID",
  is_age_verified: "Age Verified",
  isageverified: "Age Verified",
  statuscode: "Status Code",
  httpresponse: "HTTP Response",
  countrycode: "Country Code",
  messageid: "Message ID",
  responsecodes: "Response Codes",
  nicheckresults: "NI Check Results",
  telephonenotnull: "Telephone Present",
  excludefromweblookup: "Exclude From Web Lookup",
  pepfuzzy: "PEP Fuzzy",
  mccmnc: "MCC/MNC",
  msisdn: "MSISDN",
};

/**
 * Convert a camelCase, snake_case, or lowercase key into a human-readable label.
 */
export function humanizeKey(key: string): string {
  if (KEY_LABELS[key]) return KEY_LABELS[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Keys to hide from the detailed verification display (e.g. rate-limit info).
 */
const HIDDEN_KEYS = new Set([
  "consumedtotal",
  "consumedTotal",
  "remaining",
  "periodlimit",
  "periodLimit",
  "consumedthiscall",
  "consumedThisCall",
]);

/**
 * Flatten a nested object into key-value pairs for display.
 * Limits depth to avoid deeply nested display.
 */
export function flattenForDisplay(
  obj: Record<string, unknown>,
  prefix = "",
  depth = 0
): Array<{ key: string; label: string; value: string }> {
  const result: Array<{ key: string; label: string; value: string }> = [];

  if (depth > 3) return result;

  for (const [key, value] of Object.entries(obj)) {
    if (HIDDEN_KEYS.has(key)) continue;
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const label = humanizeKey(key);

    if (Array.isArray(value) && depth < 3) {
      // Flatten each array element
      value.forEach((item, i) => {
        if (item && typeof item === "object") {
          result.push(
            ...flattenForDisplay(
              item as Record<string, unknown>,
              `${fullKey}[${i}]`,
              depth + 1
            )
          );
        } else {
          result.push({
            key: `${fullKey}[${i}]`,
            label: `${label} [${i + 1}]`,
            value: formatValue(item),
          });
        }
      });
    } else if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      depth < 3
    ) {
      result.push(
        ...flattenForDisplay(
          value as Record<string, unknown>,
          fullKey,
          depth + 1
        )
      );
    } else {
      result.push({ key: fullKey, label, value: formatValue(value) });
    }
  }

  return result;
}
