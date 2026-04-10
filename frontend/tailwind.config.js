/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4C82A9",   // steel blue
        secondary: "#8DC133", // olive/green
        accent: "#FDC49B",    // sandy orange
        base: "#FFFFFF",      // white
        dark: "#000000",      // black

        // optional (recommended for better UX)
        text: "#1F2933",      // softer black
        background: "#F9FAF7" // off-white
      }
    }
  },
  plugins: [],
}
