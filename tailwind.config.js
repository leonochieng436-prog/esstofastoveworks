module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        char: "#1F2326",
        ember: "#E8630A",
        emberdark: "#B84F08",
        ash: "#F4F2EF",
      },
      borderRadius: {
        editorial: "1.25rem",
        card: "var(--radius-card)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      fontSize: {
        hero: ["var(--type-hero)", { lineHeight: "1.2" }],
        section: ["var(--type-section)", { lineHeight: "1.2" }],
        card: ["var(--type-card)", { lineHeight: "1.25" }],
        body: ["var(--type-body)", { lineHeight: "1.55" }],
        caption: ["var(--type-caption)", { lineHeight: "1.4" }],
      },
      spacing: {
        section: "var(--section-padding)",
        gutter: "var(--gutter-desktop)",
        card: "var(--card-padding)",
      },
      maxWidth: {
        container: "var(--container-max)",
      },
    },
  },
};
