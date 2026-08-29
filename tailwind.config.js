module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
          subtle: "var(--color-primary-subtle)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          light: "var(--color-accent-light)",
          subtle: "var(--color-accent-subtle)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
        },
        page: "var(--color-bg-page)",
        surface: "var(--color-bg-surface)",
        sidebar: "var(--color-bg-sidebar)",
        header: "var(--color-bg-header)",
        alt: "var(--color-bg-alt)",
        border: {
          subtle: "var(--color-border-subtle)",
          DEFAULT: "var(--color-border-light)",
          medium: "var(--color-border-medium)",
          focus: "var(--color-border-focus)",
          accent: "var(--color-border-accent)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
          brand: "var(--color-text-brand)",
          accent: "var(--color-text-accent)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

