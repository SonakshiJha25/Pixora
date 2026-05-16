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
          /** Deep indigo canvas — aligns with logo night sky */
          navy: "#12061f",
          /** Electric cyan — logo frame left / accents */
          cyan: "#22d3ee",
          /** Vibrant magenta-pink — logo frame right; pairs with cyan in CTAs */
          sky: "#f472b6",
          violet: "#a855f7",
          indigo: "#4c1d95",
        },
      },
      boxShadow: {
        glow: "0 18px 50px -20px rgba(14,165,233,0.22), 0 16px 40px -24px rgba(15,23,42,0.12)",
        card: "0 12px 40px -12px rgba(76, 29, 149, 0.1)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(780px circle at 12% 8%, rgba(56,189,248,0.16), transparent 46%), radial-gradient(640px circle at 92% 4%, rgba(165,180,252,0.12), transparent 42%), radial-gradient(560px circle at 48% 100%, rgba(129,140,248,0.09), transparent 48%), radial-gradient(900px circle at 50% 120%, rgba(248,250,252,0.94), transparent 55%)",
      },
    },
  },
  plugins: [],
};
