/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        xl: "1120px",
        "2xl": "1280px",
      },
    },

    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },

      colors: {
        // BRAND COLORS (Perfect match with your PDF)
        sx: {
          green: {
            DEFAULT: "#15803D",   // main primary green
            dark: "#166534",      // headers & accents
            light: "#4ade80",     // highlights
            soft: "#d1fae5",      // background tints
          },
          teal: {
            DEFAULT: "#10B981",   // secondary teal
            dark: "#059669",
            light: "#6ee7b7",
          },
          yellow: {
            DEFAULT: "#FACC15",   // action highlight
            dark: "#EAB308",
            light: "#FEF08A",
          },
          slate: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            600: "#475569",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A",
          },
        },

        primary: {
          DEFAULT: "#15803D",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#10B981",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#FACC15",
          foreground: "#1e1e1e",
        },
      },

      backgroundImage: {
        // HERO GRADIENT (perfect PDF match)
        "sx-hero":
          "linear-gradient(90deg, #15803D 0%, #10B981 100%)",

        // light green trust gradient
        "sx-trust":
          "linear-gradient(90deg, #ECFDF5, #F0FDF4)",

        // soft white/light for sections
        "sx-soft":
          "linear-gradient(180deg, #ffffff, #f8fafc)",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.2rem",
        "3xl": "1.4rem",
      },

      boxShadow: {
        soft: "0 4px 10px rgba(0,0,0,0.06)",
        medium: "0 6px 18px rgba(0,0,0,0.08)",
        card: "0 8px 24px rgba(0,0,0,0.10)",
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },

      fontSize: {
        "hero-title": ["3.75rem", { lineHeight: "1.1", fontWeight: "800" }], // 60px
        "hero-sub": ["1.25rem", { lineHeight: "1.6", fontWeight: "400" }],   // 20px
      },
    },
  },

  plugins: [],
};
