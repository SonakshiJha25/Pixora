/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          /** Deep charcoal-navy workspace base */
          navy: "#171b26",
          /** Muted cyan highlight — restrained, not neon */
          cyan: "#5a8fa3",
          /** Dusty indigo accents (marketing & links) */
          sky: "#6b7399",
          violet: "#5a586d",
          indigo: "#3a455a",
        },
      },
      boxShadow: {
        glow: "0 10px 36px -20px rgba(30,41,59,0.14)",
        card: "0 10px 32px -12px rgba(15,23,42,0.07)",
      },
      backgroundImage: {
        /** Calm landing wash — warm white to cool grey (no saturated mesh blobs) */
        market:
          "linear-gradient(178deg, #fdfcfa 0%, #f8f9fc 46%, #f2f4f8 100%)",
        mesh: "linear-gradient(178deg, #fdfcfa 0%, #f8f9fc 46%, #f2f4f8 100%)",
      },
    },
  },
  plugins: [],
};
