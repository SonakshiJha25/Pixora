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
        pastel: {
          sky: "#8FD8FF",
          cyan: "#6FCBFF",
          lavender: "#C7B6FF",
          lilac: "#B79CFF",
          baby: "#F6B6E8",
          blush: "#F9CFEF",
          mist: "#F9FAFF",
          pearl: "#F4F5FA",
        },
        brand: {
          /** Deep charcoal-navy workspace base */
          navy: "#171b26",
          /** Pastel cyan — aligns with illustrative brand pack */
          cyan: "#6FCBFF",
          /** Soft sky — primary marketing highlights */
          sky: "#8FD8FF",
          /** Dust accents (soft lavender family) */
          violet: "#C7B6FF",
          indigo: "#B79CFF",
        },
      },
      boxShadow: {
        glow: "0 10px 36px -20px rgba(111, 203, 255, 0.22)",
        card: "0 12px 36px -16px rgba(143, 216, 255, 0.18)",
      },
      backgroundImage: {
        /** Mist → pearl wash with a whisper of sky blue */
        market:
          "linear-gradient(168deg, #F9FAFF 0%, #F5F7FC 41%, rgba(143,216,255,0.32) 78%, rgba(199,182,255,0.12) 100%)",
        mesh: "linear-gradient(168deg, #F9FAFF 0%, #F5F7FC 41%, rgba(143,216,255,0.32) 78%, rgba(199,182,255,0.12) 100%)",
      },
    },
  },
  plugins: [],
};
