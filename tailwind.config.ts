import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // optional
  ],
  theme: { extend: { /* your colors/shadows etc. */ } },
  plugins: [],
} satisfies Config;
