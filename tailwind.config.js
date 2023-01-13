module.exports = {
  content: ["./dashboard/views/**/*.{html,js,ejs}"],
  theme: {
    fontFamily: {
      sans: ['"Source Sans Pro"', "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#3980FF",
        bggray: "#272934",
        premiumButton: "#facc15",
        darkerbggray: "#1F2129",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};