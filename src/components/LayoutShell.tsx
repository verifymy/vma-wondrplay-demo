"use client";

import { useState } from "react";
import {
  DevicePreviewToggle,
  type DeviceMode,
} from "@/components/DevicePreviewToggle";
import { BrandToggle } from "@/components/BrandToggle";
import { type Brand } from "@/lib/brand";
import { BrandProvider } from "@/lib/BrandContext";

const DEVICE_MAX_WIDTH: Record<DeviceMode, string> = {
  desktop: "max-w-none",
  tablet: "max-w-[768px]",
  mobile: "max-w-[375px]",
};

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [brand, setBrand] = useState<Brand>("wondrplay");
  const isFramed = device !== "desktop";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/vma-wondrplay-demo";

  return (
    <>
      <header className="bg-white border-b border-brand-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/logo.svg`}
              alt="verifymy"
              className="h-6"
            />
            {brand === "wondrplay" && (
              <>
                <span className="text-brand-300 text-sm font-medium">x</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}/wondrplay-logo-dark.svg`}
                  alt="wondrplay"
                  className="h-4"
                />
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <BrandToggle brand={brand} onBrandChange={setBrand} />
            <DevicePreviewToggle device={device} onDeviceChange={setDevice} />
          </div>
        </div>
      </header>

      <BrandProvider value={brand}>
        <main
          className={`transition-all duration-300 ease-in-out mx-auto ${
            DEVICE_MAX_WIDTH[device]
          } ${
            isFramed
              ? "my-6 border border-brand-200 rounded-2xl shadow-lg bg-white overflow-hidden"
              : ""
          }`}
        >
          {children}
        </main>
      </BrandProvider>

      <footer className="border-t border-brand-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-brand-400">
          <span>
            Powered by VerifyMy
            {brand === "wondrplay" && " x Wondrplay"}
          </span>
          <span className="text-xs text-brand-300">
            Internal use only &mdash; Do not share API responses externally
          </span>
        </div>
      </footer>
    </>
  );
}
