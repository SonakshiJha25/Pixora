/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
        glow:
          "0 20px 55px -18px rgba(34, 211, 238, 0.28), 0 18px 50px -22px rgba(244, 114, 182, 0.22)",
        card: "0 12px 40px -12px rgba(76, 29, 149, 0.1)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(780px circle at 12% 8%, rgba(34,211,238,0.2), transparent 46%), radial-gradient(640px circle at 92% 4%, rgba(244,114,182,0.14), transparent 42%), radial-gradient(560px circle at 48% 100%, rgba(168,85,247,0.12), transparent 48%), radial-gradient(900px circle at 50% 120%, rgba(248,250,252,0.92), transparent 55%)",
      },
    },
  },
  plugins: [],
};
