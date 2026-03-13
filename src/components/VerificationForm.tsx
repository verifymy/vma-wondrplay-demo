"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import {
  VERIFICATION_TYPES,
  REGION_LABELS,
  REGION_PHONE_PREFIXES,
  type VerificationType,
  type Region,
  type InputType,
} from "@/lib/types";
import { PhoneInput } from "./PhoneInput";

const REGIONS: Region[] = ["US", "UK", "FR"];

interface Props {
  loading: boolean;
  disabled?: boolean;
  onSubmit: (params: {
    verificationType: VerificationType;
    inputType: InputType;
    value: string;
    region?: Region;
  }) => void;
  verificationType: VerificationType;
}

export function VerificationForm({
  loading,
  disabled = false,
  onSubmit,
  verificationType,
}: Props) {
  const [inputType, setInputType] = useState<InputType>("email");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState<Region>("US");

  const typeInfo = VERIFICATION_TYPES.find((t) => t.id === verificationType)!;

  // Reset to phone if current type doesn't support email
  useEffect(() => {
    if (!typeInfo.supportsEmail && inputType === "email") {
      setInputType("phone");
    }
  }, [verificationType, typeInfo.supportsEmail, inputType]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    let value: string;
    if (inputType === "phone") {
      if (typeInfo.requiresRegion) {
        const prefix = REGION_PHONE_PREFIXES[region];
        const raw = phone.replace(/\s+/g, "");
        value = raw.startsWith("+") ? raw : `${prefix}${raw}`;
      } else {
        value = phone.replace(/\s+/g, "");
      }
    } else {
      value = email.trim();
    }

    onSubmit({
      verificationType,
      inputType,
      value,
      region: typeInfo.requiresRegion ? region : undefined,
    });
  };

  const handleReset = () => {
    setPhone("");
    setEmail("");
    setRegion("US");
    setInputType("email");
  };

  // Age Verify MNO — simpler layout
  if (verificationType === "ageVerifyMno") {
    return (
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-brand-100 bg-white p-6"
      >
        <p className="text-sm font-medium text-brand-700 mb-4">
          Enter the mobile number to verify
        </p>
        <div>
          <label className="block text-xs font-medium text-accent-600 mb-1">
            Enter mobile phone number
          </label>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            showPrefix={false}
            placeholder="+55111234567890"
          />
          <p className="mt-1.5 text-xs text-brand-400">
            Enter the full number including country code. Use numbers only.
            (E.164 format)
          </p>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-brand-500 hover:text-brand-700 transition-colors"
          >
            Set new parameter
          </button>
          <button
            type="submit"
            disabled={loading || disabled}
            className="flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Run verification"
            )}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-brand-100 bg-white p-6"
    >
      <div
        className={`grid gap-6 ${typeInfo.requiresRegion && inputType === "phone" ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
      >
        {/* Verification method */}
        {typeInfo.supportsEmail && (
          <div>
            <p className="text-sm font-medium text-brand-700 mb-3">
              Verification method
            </p>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="inputType"
                  checked={inputType === "email"}
                  onChange={() => setInputType("email")}
                  className="vm-radio"
                />
                <span className="text-sm text-brand-700 group-hover:text-brand-900">
                  Email address
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="inputType"
                  checked={inputType === "phone"}
                  onChange={() => setInputType("phone")}
                  className="vm-radio"
                />
                <span className="text-sm text-brand-700 group-hover:text-brand-900">
                  Phone number
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Target region — only visible when phone is selected */}
        {typeInfo.requiresRegion && inputType === "phone" && (
          <div>
            <p className="text-sm font-medium text-brand-700 mb-3">
              Target region
            </p>
            <div className="space-y-2.5">
              {REGIONS.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="region"
                    checked={region === r}
                    onChange={() => setRegion(r)}
                    className="vm-radio"
                  />
                  <span className="text-sm text-brand-700 group-hover:text-brand-900">
                    {REGION_LABELS[r]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Input field */}
        <div>
          {inputType === "phone" ? (
            <div>
              <label className="block text-xs font-medium text-accent-600 mb-1">
                Enter mobile phone number
              </label>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                region={region}
                showPrefix={typeInfo.requiresRegion}
                placeholder={
                  typeInfo.requiresRegion
                    ? "012 345 6789"
                    : "+447904016349"
                }
              />
              <p className="mt-1.5 text-xs text-brand-400">
                {typeInfo.requiresRegion
                  ? "Enter your 10-digit mobile number without the country code (e.g., 012 345 6789)."
                  : "Enter the full number including country code. Use numbers only. (E.164 format)"}
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-accent-600 mb-1">
                Enter email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@example"
                className="w-full rounded-lg border border-brand-200 bg-white px-4 py-2.5 text-sm text-brand-900 placeholder:text-brand-300 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
              <p className="mt-1.5 text-xs text-brand-400">
                Enter a valid email address you want to verify.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-brand-500 hover:text-brand-700 transition-colors"
        >
          Set new parameter
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-700 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Run verification"
          )}
        </button>
      </div>
    </form>
  );
}
