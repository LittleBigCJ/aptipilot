import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // optional if you still use /pages
  ],
  theme: {
    extend: {
      // your colors/radius/shadows etc…
    },
  },
  plugins: [],
} satisfies Config;
