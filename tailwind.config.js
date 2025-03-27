/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "wave-pulse": {
          "0%, 100%": {
            transform: "scale(0.5)",
            opacity: "0.3",
          },
          "50%": {
            transform: "scale(1)",
            opacity: "0.1",
          },
        },
      },
      animation: {
        "wave-pulse": "wave-pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".animation-delay-300": {
          "animation-delay": "300ms",
        },
        ".animation-delay-600": {
          "animation-delay": "600ms",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
