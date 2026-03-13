"use client";

import { useState } from "react";
import {
  DevicePreviewToggle,
  type DeviceMode,
} from "@/components/DevicePreviewToggle";

const DEVICE_MAX_WIDTH: Record<DeviceMode, string> = {
  desktop: "max-w-none",
  tablet: "max-w-[768px]",
  mobile: "max-w-[375px]",
};

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const isFramed = device !== "desktop";

  return (
    <>
      <header className="bg-white border-b border-brand-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || "/vma-mobile-delta"}/logo.svg`}
            alt="verifymy"
            className="h-6"
          />
          <DevicePreviewToggle device={device} onDeviceChange={setDevice} />
        </div>
      </header>

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

      <footer className="border-t border-brand-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-brand-400">
          <span>Powered by VerifyMy</span>
          <span className="text-xs text-brand-300">
            Internal use only &mdash; Do not share API responses externally
          </span>
        </div>
      </footer>
    </>
  );
}
