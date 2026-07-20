/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eefaf6",
          100: "#d6f2e7",
          200: "#ade5cf",
          300: "#7dd3b5",
          400: "#4ab897",
          500: "#279d7d",
          600: "#1a7d64",
          700: "#186352",
          800: "#164f43",
          900: "#134239",
        },
        dark: {
          900: "#0a0e17",
          800: "#111827",
          700: "#1a2234",
          600: "#232d42",
          500: "#2e3a52",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
