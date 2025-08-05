/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./index.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Color palette (atomic design tokens)
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
        accent: {
          100: "#FBC916",
          200: "#FFE1B2",
          300: "#FDD495",
          400: "#FBC878",
          500: "#FFBB50",
        },
        angry: {
          100: "#F2D6CD",
          500: "#C03403",
        },
        // Semantic colors (static)
        error: "#C03403",
        errorBackground: "#F2D6CD",
        overlay: {
          20: "rgba(25, 16, 21, 0.2)",
          50: "rgba(25, 16, 21, 0.5)",
        },
        transparent: "rgba(0, 0, 0, 0)",
      },
      // Spacing (atomic design tokens)
      spacing: {
        xxxs: "2px",
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        xxxl: "64px",
      },
      // Typography (atomic design tokens)
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        md: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "32px"],
        xxl: ["24px", "36px"],
      },
      fontFamily: {
        primary: ["Inter", "sans-serif"],
        secondary: ["Inter", "sans-serif"],
      },
      // Border radius (atomic design tokens)
      borderRadius: {
        sm: "2px",
        md: "4px",
        lg: "8px",
        xl: "12px",
      },
      // Border width (atomic design tokens)
      borderWidth: {
        xs: "1px",
        sm: "2px",
        md: "3px",
        lg: "4px",
      },
      // Shadows (atomic design tokens)
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        // Custom shadows for React Native
        card: "0 2px 4px rgba(0, 0, 0, 0.1)",
        button: "0 1px 3px rgba(0, 0, 0, 0.12)",
        input: "0 1px 2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [
    // Common utility patterns (not component-specific)
    function ({ addUtilities }) {
      addUtilities({
        // Layout utilities
        ".flex-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ".flex-between": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        ".flex-start": {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        },
        ".flex-end": {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        },
        // Text utilities
        ".text-heading": {
          fontSize: "18px",
          fontWeight: "600",
          color: "#09162E",
        },
        ".text-body": {
          fontSize: "16px",
          fontWeight: "400",
          color: "#132B5B",
        },
        ".text-caption": {
          fontSize: "14px",
          fontWeight: "400",
          color: "#1D4490",
        },
        ".text-label": {
          fontSize: "14px",
          fontWeight: "500",
          color: "#09162E",
        },
        // Border utilities
        ".border-default": {
          borderWidth: "1px",
          borderColor: "#C7D1E5",
        },
        ".border-error": {
          borderWidth: "1px",
          borderColor: "#C03403",
        },
        ".border-primary": {
          borderWidth: "1px",
          borderColor: "#4C6DAD",
        },
        // Shadow utilities
        ".shadow-card": {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        ".shadow-button": {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.12,
          shadowRadius: 3,
          elevation: 2,
        },
        ".shadow-input": {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        },
      })
    },
  ],
}
