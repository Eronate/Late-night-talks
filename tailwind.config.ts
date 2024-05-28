import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
      },
      keyframes: {
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
      },
      colors: {
        'navycustom': '#37306B',
        'navylight': '#66347F',
        'maroon': '#9E4784',
        'maroonlight': '#D27685',
        'black2': '#030637',
        'navy2': '#3C0753',
        'maroon2': '#720455',
        'purplecustom': '#910A67',
        'customcoolcolor': 'rgb(67,45,128)',
        'brownish4': '#49243E',
        'brownish3': '#704264',
        'brownish2': '#BB8493',
        'brownish': '#DBAFA0',
      }
    },
  },
  plugins: [],
};
export default config;
