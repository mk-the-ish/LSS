import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        lss: {
          bg: "#08100c",
          panel: "rgba(9, 17, 13, 0.78)",
          gold: "#f1c84c",
          green: "#3dc85f",
          charcoal: "#101815",
        },
      },
      boxShadow: {
        glow: "0 24px 80px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
