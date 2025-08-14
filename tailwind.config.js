/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./index.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Spacing (static design tokens)
      spacing: {
        "xxxs": "2px",
        "xxs": "4px",
        "xs": "8px",
        "sm": "12px",
        "md": "16px",
        "lg": "24px",
        "xl": "32px",
        "xxl": "48px",
        "xxxl": "64px",
        "button": "56px",
        // Welcome screen specific
        "neg-12": "-47px",
        "neg-20": "-80px",
      },
      // Border radius (static design tokens)
      borderRadius: {
        "sm": "2px",
        "md": "4px",
        "lg": "8px",
        "xl": "12px",
        "2xl": "16px",
      },
      // Border width (static design tokens)
      borderWidth: {
        xs: "1px",
        sm: "2px",
        md: "3px",
        lg: "4px",
      },
      // Shadows (static design tokens)
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
    // Common utility patterns (static only)
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
        // Border utilities (static colors only)
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
        // Welcome screen specific utilities
        ".flex-basis-57": {
          flexBasis: "57%",
        },
        ".flex-basis-43": {
          flexBasis: "43%",
        },
        ".h-22": {
          height: "88px",
        },
        ".h-42": {
          height: "169px",
        },
        ".w-67": {
          width: "269px",
        },
        ".bottom-neg-12": {
          bottom: "-47px",
        },
        ".right-neg-20": {
          right: "-80px",
        },
      })
    },
  ],
}
