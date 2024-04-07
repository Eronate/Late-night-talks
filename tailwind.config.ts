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
      }
    },
  },
  plugins: [],
};
export default config;
