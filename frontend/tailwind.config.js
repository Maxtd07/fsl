/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "770px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        primary: "#0E50AB",   // steel blue - primary elements, CTA, focus
        secondary: "#5A9638", // olive/green - success, support, events
        accent: "#FFEE24",    // sandy orange - hover, highlight, interactions
        base: "#FFFFFF",      // white - containers
        dark: "#000000",      // black - dark backgrounds
        text: "#1F2933",      // softer black - default text
        background: "#F9FAF7" // off-white - alternating rows, secondary bg
      },
      // Custom shadows - subtle, elegant, almost imperceptible
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.10)',
        'xl': '0 16px 24px rgba(0, 0, 0, 0.12)',
        // Soft shadows for cards
        'card': '0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.08)',
        // Focus ring shadow with primary color
        'focus-ring': '0 0 0 3px rgba(76, 130, 169, 0.1)',
      },
      // Transitions - smooth, 200-300ms
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // Rounded corners - consistent hierarchy
      borderRadius: {
        'sm': '0.25rem',   // 4px
        'base': '0.5rem',  // 8px (Tailwind default rounded)
        'md': '0.625rem',  // 10px
        'lg': '0.75rem',   // 12px
        'xl': '1rem',      // 16px
        'full': '9999px',
      },
      // Spacing - coherent scale
      spacing: {
        '0': '0',
        '0.5': '0.125rem',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
      },
      // Focus ring - always visible for accessibility
      outline: {
        'focus': '3px solid rgba(76, 130, 169, 0.5)',
      },
    }
  },
  plugins: [],
}
