export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f7f6f4",
          100: "#eceae5",
          200: "#d8d3c9",
          300: "#c2b9a8",
          400: "#a89b86",
          500: "#8e7d67",
          600: "#6f6250",
          700: "#574d40",
          800: "#3f3931",
          900: "#2c2823",
        },
        olive: {
          100: "#e7eadf",
          300: "#b7bf9a",
          500: "#7c8753",
          700: "#4f5636",
        },
        grape: {
          400: "#7a6a7a",
          600: "#5c4f5c",
        },
      },
    },
  },
  plugins: [],
};
