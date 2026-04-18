import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#05070d",
          900: "#0a0f1c",
          800: "#111a2e",
          700: "#1a2544",
          600: "#243366",
        },
        ember: {
          50: "#fff4ec",
          100: "#ffe0c7",
          200: "#ffb37a",
          300: "#ff8a3d",
          400: "#ff6b1a",
          500: "#ff4d00",
          600: "#e03a00",
          700: "#b52c00",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        ember: "0 0 30px rgba(255, 77, 0, 0.35)",
        emberStrong: "0 0 60px rgba(255, 77, 0, 0.6)",
      },
      keyframes: {
        pulseBurn: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 77, 0, 0.5)", transform: "scale(1)" },
          "50%": { boxShadow: "0 0 60px rgba(255, 77, 0, 0.9)", transform: "scale(1.02)" },
        },
        flashGreen: {
          "0%": { backgroundColor: "rgba(34, 197, 94, 0.35)" },
          "100%": { backgroundColor: "transparent" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        pulseBurn: "pulseBurn 1.5s ease-in-out infinite",
        flashGreen: "flashGreen 2.5s ease-out 1",
        shimmer: "shimmer 2.5s linear infinite",
      },
      backgroundImage: {
        "starfield":
          "radial-gradient(ellipse at top, rgba(36, 51, 102, 0.35), transparent 55%), radial-gradient(ellipse at bottom, rgba(255, 77, 0, 0.12), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
