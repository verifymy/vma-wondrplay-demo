import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#f3f3f3",
          100: "#e6e6e6",
          200: "#cecece",
          300: "#a5a5a5",
          400: "#858585",
          500: "#595959",
          600: "#444444",
          700: "#333232",
          800: "#181818",
          900: "#000000",
          950: "#000000",
        },
        accent: {
          50: "#eaf6f6",
          100: "#d0ebeb",
          200: "#b9dfdf",
          300: "#8fd1d0",
          400: "#73c0bf",
          500: "#73c0bf",
          600: "#408d8c",
          700: "#306a69",
          800: "#245150",
          900: "#1a3b3a",
          950: "#0f2322",
        },
        status: {
          operational: "#22c55e",
          monitoring: "#f59e0b",
          progress: "#3b82f6",
          inactive: "#94a3b8",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
