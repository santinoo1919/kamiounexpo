/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./index.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        neutral: {
          100: "#FFFFFF",
          200: "#E9EDF5",
          300: "#C7D1E5",
          400: "#7991C1",
          500: "#4C6DAD",
          600: "#1D4490",
          700: "#173672",
          800: "#132B5B",
          900: "#09162E",
        },
        primary: {
          100: "#1F4898",
          200: "#E9EDF5",
          300: "#C7D1E5",
          400: "#7991C1",
          500: "#4C6DAD",
          600: "#1D4490",
        },
        secondary: {
          100: "#DCDDE9",
          200: "#BCC0D6",
          300: "#9196B9",
          400: "#626894",
          500: "#41476E",
        },
      },
    },
  },
  plugins: [],
}
