import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        disappear: "disappear 3s ease-in-out",
      },
    },
    keyframes: {
      disappear: {
        "0%": { opacity: "1" },
        "50%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
    },
  },
  plugins: [],
};

export default config;
