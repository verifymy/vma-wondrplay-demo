/**
 * Browser-side API client for calling HBAuth endpoints directly.
 * Used for static GitHub Pages deployment where Next.js API routes are unavailable.
 * Credentials are baked in at build time via NEXT_PUBLIC_ env vars.
 */

import type {
  VerificationType,
  InputType,
  Region,
  VerifyResponse,
} from "./types";
import { isValidE164, isValidEmail, isValidRegion } from "./validation";

const API_KEY = process.env.NEXT_PUBLIC_HBAUTH_API_KEY ?? "";
const BASE_URL = process.env.NEXT_PUBLIC_HBAUTH_BASE_URL ?? "";
const CUSTOMER_ID = process.env.NEXT_PUBLIC_HBAUTH_CUSTOMER_ID ?? "";

const TIMEOUT_MS = 15_000;

const ENDPOINT_MAP: Record<VerificationType, string> = {
  identityGraph: "/api/v1/riskinsights/analysis/identityGraphAV",
  ageVerifyMno: "/api/v1/riskinsights/check",
  reverseLookup: "/api/v1/riskinsights/analysis/hbverifymy/reverselookupav",
};

async function callHbAuth(
  endpoint: string,
  body: Record<string, unknown>
): Promise<{ status: number; data: Record<string, unknown> }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: API_KEY,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out after 15 seconds");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function buildIdentityGraphBody(
  inputType: InputType,
  value: string,
  region: Region
): Record<string, string> {
  const body: Record<string, string> = {
    customerid: CUSTOMER_ID,
    country: region,
  };
  if (inputType === "phone") {
    body.phone = value;
  } else {
    body.email = value;
  }
  return body;
}

function buildAgeVerifyBody(value: string): Record<string, unknown> {
  return {
    type: "ri",
    customerid: CUSTOMER_ID,
    config: {
      nilookup: ["ageverifymno"],
    },
    records: [
      {
        contacts: [
          {
            phone: value,
          },
        ],
      },
    ],
  };
}

function buildReverseLookupBody(
  inputType: InputType,
  value: string
): Record<string, string> {
  const body: Record<string, string> = {};
  if (inputType === "phone") {
    body.phone = value;
  } else {
    body.email = value;
  }
  return body;
}

export async function verify(params: {
  verificationType: VerificationType;
  inputType: InputType;
  value: string;
  region?: Region;
}): Promise<VerifyResponse> {
  const { verificationType, inputType, value, region } = params;

  // --- Validation ---
  if (verificationType === "identityGraph") {
    if (!region || !isValidRegion(region)) {
      throw new Error("Region is required and must be US, UK, or FR");
    }
  }

  if (verificationType === "ageVerifyMno" && inputType !== "phone") {
    throw new Error("Age Verify MNO only supports phone number lookups");
  }

  if (inputType === "phone" && !isValidE164(value)) {
    throw new Error("Phone must be in E.164 format (e.g. +14155551234)");
  }

  if (inputType === "email" && !isValidEmail(value)) {
    throw new Error("Invalid email address");
  }

  // --- Build request body ---
  let body: Record<string, unknown>;
  switch (verificationType) {
    case "identityGraph":
      body = buildIdentityGraphBody(inputType, value, region!);
      break;
    case "ageVerifyMno":
      body = buildAgeVerifyBody(value);
      break;
    case "reverseLookup":
      body = buildReverseLookupBody(inputType, value);
      break;
  }

  // --- Call API ---
  const endpoint = ENDPOINT_MAP[verificationType];
  const result = await callHbAuth(endpoint, body);

  return {
    success: result.status >= 200 && result.status < 300,
    verificationType,
    timestamp: new Date().toISOString(),
    raw: result.data,
    inputType,
    inputValue: value,
    region,
  };
}
