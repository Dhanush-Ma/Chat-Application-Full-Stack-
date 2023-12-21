/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBlack: "#0b0c11",
        primaryBlue: "#1b24aa",
        primaryBg: "#313846",

        blueShade1: "#0449e9",
        blueShade2: "#1a429c",
        blueShade3: "#5195ea",

        greyShade1: "#595b63",
        greyShade2: "#ededee",
        greyShade3: "#9c9da2",
      },
    },
  },
  plugins: [],
};
