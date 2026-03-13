"use client";

import { useState, useCallback } from "react";
import type {
  VerificationType,
  Region,
  InputType,
  VerifyResponse,
} from "@/lib/types";
import { verify } from "@/lib/api-client-browser";

interface UseVerificationReturn {
  loading: boolean;
  error: string | null;
  result: VerifyResponse | null;
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
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const data = await verify(params);
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

  return { loading, error, result, submit, reset };
}
