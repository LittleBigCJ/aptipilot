import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary vibe
        primary: {
          50:  "#eef7ff",
          100: "#e2f0ff",
          200: "#cde4ff",
          300: "#a9d1ff",
          400: "#78b6ff",
          500: "#4a9aff", // main
          600: "#2f7ced",
          700: "#1f5fbe",
          800: "#1c4f98",
          900: "#183f78",
        },
        // Accents
        accent: {
          50:  "#f5f0ff",
          100: "#ede6ff",
          200: "#dacdff",
          300: "#c1a9ff",
          400: "#a07aff",
          500: "#7e4aff",
          600: "#6a2fed",
          700: "#5221be",
          800: "#431c98",
          900: "#361878",
        },
        // Neutrals
        ink: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1f2937",
          900: "#0b1220",
        },
      },
      boxShadow: {
        soft: "0 2px 12px rgba(2, 6, 23, 0.08)",         // subtle
        lift: "0 10px 30px rgba(37, 99, 235, 0.18)",     // blue glow
        glass: "inset 0 1px 0 rgba(255,255,255,.5)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.5rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
