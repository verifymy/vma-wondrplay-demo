"use client";

import { Search, Loader2 } from "lucide-react";
import { VerificationForm } from "@/components/VerificationForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { useVerification } from "@/hooks/useVerification";
import { useBrand } from "@/lib/BrandContext";

function StepBadge({ step, wondrplay }: { step: number; wondrplay?: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
      wondrplay ? "bg-[#6744E7]/10 text-[#6744E7]" : "bg-accent-50 text-accent-700"
    }`}>
      Step {step}
    </span>
  );
}

export default function Home() {
  const { loading, error, result, submit } = useVerification();
  const brand = useBrand();
  const isWondrplay = brand === "wondrplay";

  return (
    <div>
      {/* Hero Section */}
      <section className={`py-10 sm:py-14 ${isWondrplay ? "bg-[#6744E7]/5" : "bg-brand-50"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className={`rounded-full p-3 ${isWondrplay ? "bg-[#6744E7]/15" : "bg-accent-100"}`}>
              <Search className={`w-6 h-6 ${isWondrplay ? "text-[#6744E7]" : "text-accent-600"}`} />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-950">
            Reverse lookup explorer
          </h1>
          <p className="mt-3 text-sm sm:text-base text-brand-500 max-w-2xl mx-auto">
            Enter an email address or phone number to perform a reverse identity
            lookup across supported regions.
          </p>
        </div>
      </section>

      {/* Step 1 — Configure parameters */}
      <section className="bg-white py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <StepBadge step={1} wondrplay={isWondrplay} />
          <h2 className="mt-2 text-lg font-semibold text-brand-900">
            Configure parameters
          </h2>
          <div className="mt-5">
            <VerificationForm
              loading={loading}
              onSubmit={submit}
              verificationType="reverseLookup"
            />
          </div>
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Step 2 — Results */}
      <section className="bg-brand-50/50 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <StepBadge step={2} wondrplay={isWondrplay} />
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
