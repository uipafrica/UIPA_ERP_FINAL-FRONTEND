/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#8B2332", // Burgundy
                    foreground: "hsl(var(--primary-foreground))",
                    50: "#fdf2f3",
                    100: "#fce4e6",
                    200: "#fbcfd3",
                    300: "#f5a5ac",
                    400: "#ef7983",
                    500: "#e34d5c",
                    600: "#d42d3d",
                    700: "#8B2332", // Main brand color
                    800: "#8B2332", // Keep consistent
                    900: "#7a1f2c",
                    950: "#420f16",
                },
                secondary: {
                    DEFAULT: "#725F4B", // Brown
                    foreground: "hsl(var(--secondary-foreground))",
                    50: "#f8f6f4",
                    100: "#efeae4",
                    200: "#ded3c8",
                    300: "#c7b7a5",
                    400: "#ab9580",
                    500: "#967e66",
                    600: "#725F4B", // Main secondary color
                    700: "#725F4B", // Keep consistent
                    800: "#4e4133",
                    900: "#42372d",
                    950: "#241e19",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
