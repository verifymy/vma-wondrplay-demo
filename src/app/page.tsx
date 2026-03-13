"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { VerificationForm } from "@/components/VerificationForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { VerificationTypeCard } from "@/components/VerificationTypeCard";
import { useVerification } from "@/hooks/useVerification";
import { VERIFICATION_TYPES, type VerificationType } from "@/lib/types";

function StepBadge({ step }: { step: number }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
      Step {step}
    </span>
  );
}

export default function Home() {
  const { loading, error, result, submit } = useVerification();
  const [verificationType, setVerificationType] =
    useState<VerificationType>("identityGraph");

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-brand-50 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-accent-100 p-3">
              <Search className="w-6 h-6 text-accent-600" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-950">
            Identity verification explorer
          </h1>
          <p className="mt-3 text-sm sm:text-base text-brand-500 max-w-2xl mx-auto">
            Enter an email address or phone number to verify identity, check
            age, or perform a reverse lookup across supported regions.
          </p>
        </div>
      </section>

      {/* Step 1 — Select verification type */}
      <section className="bg-brand-50/50 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <StepBadge step={1} />
          <h2 className="mt-2 text-lg font-semibold text-brand-900">
            Select verification type
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {VERIFICATION_TYPES.map((info) => (
              <VerificationTypeCard
                key={info.id}
                info={info}
                selected={verificationType === info.id}
                onSelect={() => setVerificationType(info.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Step 2 — Configure parameters */}
      <section className="bg-white py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <StepBadge step={2} />
          <h2 className="mt-2 text-lg font-semibold text-brand-900">
            Configure parameters
          </h2>
          <div className="mt-5">
            <VerificationForm
              loading={loading}
              onSubmit={submit}
              verificationType={verificationType}
            />
          </div>
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Step 3 — Results */}
      <section className="bg-brand-50/50 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <StepBadge step={3} />
          <h2 className="mt-2 text-lg font-semibold text-brand-900">
            Results
          </h2>
          <div className="mt-5">
            {loading ? (
              <div className="rounded-xl bg-accent-50/50 border border-brand-100 py-16 text-center">
                <Loader2 className="w-8 h-8 text-accent-500 animate-spin mx-auto" />
                <p className="mt-3 text-sm font-medium text-brand-700">
                  Running verification...
                </p>
                <p className="mt-1 text-xs text-brand-400">
                  This may take a few seconds
                </p>
              </div>
            ) : result ? (
              <ResultsPanel result={result} />
            ) : (
              <div className="rounded-xl bg-accent-50/30 border border-brand-100 py-16 text-center">
                <p className="text-base font-semibold text-brand-700">
                  No verification results available
                </p>
                <p className="mt-2 text-sm text-brand-400 max-w-md mx-auto">
                  Dashboard results will appear after configuration and data
                  input. Add a source to begin processing email and phone
                  verifications.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
