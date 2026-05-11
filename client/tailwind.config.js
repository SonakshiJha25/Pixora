/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0b1224",
          cyan: "#06b6d4",
          sky: "#38bdf8",
        },
      },
      boxShadow: {
        glow: "0 24px 80px -20px rgba(6, 182, 212, 0.35)",
        card: "0 12px 40px -12px rgba(15, 23, 42, 0.12)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(900px circle at 10% 10%, rgba(6,182,212,0.22), transparent 45%), radial-gradient(700px circle at 90% 0%, rgba(56,189,248,0.16), transparent 40%), radial-gradient(600px circle at 50% 100%, rgba(14,165,233,0.12), transparent 45%)",
      },
    },
  },
  plugins: [],
};
