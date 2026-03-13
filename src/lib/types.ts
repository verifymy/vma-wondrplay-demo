export type VerificationType = "identityGraph" | "ageVerifyMno" | "reverseLookup";

export type Region = "US" | "UK" | "FR";

export type InputType = "phone" | "email";

export const REGION_LABELS: Record<Region, string> = {
  US: "United States",
  UK: "United Kingdom",
  FR: "France",
};

export const REGION_PHONE_PREFIXES: Record<Region, string> = {
  US: "+1",
  UK: "+44",
  FR: "+33",
};

export const REGION_FLAGS: Record<Region, string> = {
  US: "\u{1F1FA}\u{1F1F8}",
  UK: "\u{1F1EC}\u{1F1E7}",
  FR: "\u{1F1EB}\u{1F1F7}",
};

export interface VerificationTypeInfo {
  id: VerificationType;
  label: string;
  description: string;
  supportsEmail: boolean;
  supportsPhone: boolean;
  requiresRegion: boolean;
}

export const VERIFICATION_TYPES: VerificationTypeInfo[] = [
  {
    id: "identityGraph",
    label: "Identity graph",
    description: "Full identity verification across multiple data sources.",
    supportsEmail: true,
    supportsPhone: true,
    requiresRegion: true,
  },
  {
    id: "ageVerifyMno",
    label: "Age verify (MNO)",
    description: "Age verification via Mobile Network Operator.",
    supportsEmail: false,
    supportsPhone: true,
    requiresRegion: false,
  },
  {
    id: "reverseLookup",
    label: "Reverse lookup",
    description:
      "Reverse identity lookup from a phone number or email address.",
    supportsEmail: true,
    supportsPhone: true,
    requiresRegion: false,
  },
];

// --- Request types ---

export interface VerifyRequest {
  verificationType: VerificationType;
  inputType: InputType;
  value: string; // phone in E.164 or email
  region?: Region;
}

// --- Response types ---

export interface VerifyResponse {
  success: boolean;
  verificationType: VerificationType;
  timestamp: string;
  raw: Record<string, unknown>;
  /** Form metadata for the Configuration card */
  inputType: InputType;
  inputValue: string;
  region?: Region;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
}
