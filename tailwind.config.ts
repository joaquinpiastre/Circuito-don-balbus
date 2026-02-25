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
        brand: {
          black: "#000000",
          graphite: "#0f0f0f",
          dark: "#1a1a1a",
          red: "#E63946",
          "red-dark": "#C1121F",
          yellow: "#FFD000",
          "yellow-light": "#FFE566",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Oswald", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "tire-pattern": "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23ffffff' stroke-opacity='0.03' stroke-width='0.5'/%3E%3C/svg%3E\")",
        "dirt-gradient": "linear-gradient(180deg, rgba(26,26,26,0.95) 0%, rgba(10,10,10,1) 100%)",
      },
      boxShadow: {
        "glow-red": "0 0 20px rgba(230, 57, 70, 0.4)",
        "glow-yellow": "0 0 20px rgba(255, 208, 0, 0.35)",
      },
      animation: {
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
