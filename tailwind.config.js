/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#00f0ff", // Electric/Neon Blue
        secondary: "#1a1a1a", // Dark Gray
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        orbitron: ['var(--font-orbitron)'],
      }
    },
  },
  plugins: [],
};
