"use client";

import { useState, useCallback } from "react";
import type {
  VerificationType,
  Region,
  InputType,
  VerifyResponse,
} from "@/lib/types";
import { verify } from "@/lib/api-client-browser";

const MAX_TRIES = 50;
const STORAGE_KEY = "vma_verification_count";

function getUsageCount(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

function incrementUsageCount(): number {
  const count = getUsageCount() + 1;
  localStorage.setItem(STORAGE_KEY, String(count));
  return count;
}

interface UseVerificationReturn {
  loading: boolean;
  error: string | null;
  result: VerifyResponse | null;
  usageCount: number;
  remainingTries: number;
  submit: (params: {
    verificationType: VerificationType;
    inputType: InputType;
    value: string;
    region?: Region;
  }) => Promise<void>;
  reset: () => void;
}

export function useVerification(): UseVerificationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [usageCount, setUsageCount] = useState(getUsageCount);

  const remainingTries = Math.max(0, MAX_TRIES - usageCount);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  const submit = useCallback(
    async (params: {
      verificationType: VerificationType;
      inputType: InputType;
      value: string;
      region?: Region;
    }) => {
      if (getUsageCount() >= MAX_TRIES) {
        setError(
          `Usage limit reached (${MAX_TRIES} verifications). Please contact support for additional access.`
        );
        return;
      }

      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const data = await verify(params);
        const newCount = incrementUsageCount();
        setUsageCount(newCount);
        setResult(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, result, usageCount, remainingTries, submit, reset };
}
