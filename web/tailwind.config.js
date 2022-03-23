module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: 'Overpass, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      mono: "Overpass Mono, monospace",
    },
    container: {
      center: true,
    },
    extend: {
      screens: {
        "2xl": "1372px",
      },
      screens: {
        "2xl": "1372px",
        "3xl": "1536px",
      },
      colors: {
        gray: {
          darkest: "#30353E",
          dark: "#444444",
          DEFAULT: "#5C626F",
          light: "#707376",
          lightest: "#999999",
        },
        green: {
          muted: "#66D78F",
          dark: "#17DA88",
          DEFAULT: "#00EF8B",
        },
        blue: {
          DEFAULT: "#1972A4",
        },
        gold: {
          DEFAULT: "#E67B49",
        },
        purple: {
          DEFAULT: "#512BBD",
        },
        red: {
          DEFAULT: "#E55A3D",
        },
      },
      minWidth: {
        40: "10rem",
      },
    },
  },

  plugins: [],
}
