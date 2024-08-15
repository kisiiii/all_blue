/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tan: "#c6a286",
        "colors-black-800": "#474a57",
        "colors-black": "#18191f",
        black: "#000",
        azure: "#e3f6f4",
        white: "#fff",
        paleturquoise: "#b6e4d3",
      },
      spacing: {},
      fontFamily: {
        montserrat: "Montserrat",
      },
      borderRadius: {
        "31xl": "50px",
        xl: "20px",
      },
    },
    fontSize: {
      mini: "15px",
      base: "16px",
      "5xl": "24px",
      inherit: "inherit",
    },
  },
  corePlugins: {
    preflight: false,
  },
};
