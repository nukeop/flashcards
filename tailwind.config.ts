import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                base: 'rgb(var(--color-base) / <alpha-value>)',
                surface: 'rgb(var(--color-surface) / <alpha-value>)',
                overlay: 'rgb(var(--color-overlay) / <alpha-value>)',
                muted: 'rgb(var(--color-muted) / <alpha-value>)',
                subtle: 'rgb(var(--color-subtle) / <alpha-value>)',
                text: 'rgb(var(--color-text) / <alpha-value>)',
                accent: 'rgb(var(--color-accent) / <alpha-value>)',
                'theme-red': 'rgb(var(--color-theme-red) / <alpha-value>)',
                'base-contrast':
                    'rgb(var(--color-base-contrast) / <alpha-value>)',
                'surface-contrast':
                    'rgb(var(--color-surface-contrast) / <alpha-value>)',
                'overlay-contrast':
                    'rgb(var(--color-overlay-contrast) / <alpha-value>)',
                'muted-contrast':
                    'rgb(var(--color-muted-contrast) / <alpha-value>)',
                'subtle-contrast':
                    'rgb(var(--color-subtle-contrast) / <alpha-value>)',
                'text-contrast':
                    'rgb(var(--color-text-contrast) / <alpha-value>)',
                'accent-contrast':
                    'rgb(var(--color-accent-contrast) / <alpha-value>)',
            },
        },
    },
    plugins: [],
};
export default config;
