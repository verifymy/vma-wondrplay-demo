"use client";

import { Monitor, Tablet, Smartphone } from "lucide-react";

export type DeviceMode = "desktop" | "tablet" | "mobile";

interface DevicePreviewToggleProps {
  device: DeviceMode;
  onDeviceChange: (device: DeviceMode) => void;
}

const DEVICES: { mode: DeviceMode; icon: typeof Monitor; label: string }[] = [
  { mode: "desktop", icon: Monitor, label: "Desktop" },
  { mode: "tablet", icon: Tablet, label: "Tablet" },
  { mode: "mobile", icon: Smartphone, label: "Mobile" },
];

export function DevicePreviewToggle({
  device,
  onDeviceChange,
}: DevicePreviewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-brand-50 p-1">
      {DEVICES.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => onDeviceChange(mode)}
          title={label}
          className={`rounded-md p-1.5 transition-colors ${
            device === mode
              ? "bg-accent-500 text-white"
              : "text-brand-400 hover:text-brand-700 hover:bg-brand-100"
          }`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
