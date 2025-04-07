import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2e8b57", // Verde IFTM
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#d9534f", // Vermelho IFTM
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#d9534f", // Vermelho IFTM
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#e6f7ef", // Verde claro para acentos
          foreground: "#2e8b57",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#333333",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#333333",
        },
        iftm: {
          red: "#d9534f",
          green: "#2e8b57",
          darkGreen: "#1e5d3a",
          lightGreen: "#e6f7ef",
          gray: "#333333",
          lightGray: "#f8f9fa",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
};

export default config;
