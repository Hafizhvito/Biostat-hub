import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        "brand-navy": "#0b2e3d",
        "brand-teal": "#0f6e6e",
        "brand-mint": "#1fb6a6",
        "brand-bg-light": "#f7faf9",
        "brand-teal-soft": "#e3f3f1",
        /* Design 2 — mockup beranda (biru bersih + putih) */
        "d2-blue": "#3b82f6",
        "d2-blue-dark": "#2563eb",
        /* Design 3 — plum + terracotta, editorial hangat */
        "d3-plum": "#5c4d6d",
        "d3-plum-dark": "#3d3349",
        "d3-coral": "#d4715c",
        "d3-coral-soft": "#f5ddd6",
        "d3-sand": "#ece6df",
        "d3-surface": "#faf8f6",
        "d3-ink": "#2a2520",
        "d3-muted": "#7a7268",
      },
    },
  },
};

export default config;
