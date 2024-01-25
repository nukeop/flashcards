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
                'theme-blue': 'rgb(var(--color-theme-blue) / <alpha-value>)',
                'theme-gold': 'rgb(var(--color-theme-gold) / <alpha-value>)',
                'theme-green': 'rgb(var(--color-theme-green) / <alpha-value>)',
                'theme-purple':
                    'rgb(var(--color-theme-purple) / <alpha-value>)',
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
                'highlight-low':
                    'rgb(var(--color-highlight-low) / <alpha-value>)',
                'highlight-medium':
                    'rgb(var(--color-highlight-medium) / <alpha-value>)',
                'highlight-high':
                    'rgb(var(--color-highlight-high) / <alpha-value>)',
            },
            dropShadow: {
                glow: [
                    '0px 0px 4px rgba(255,255, 255, 0.5)',
                    '0px 0px 8px rgba(255, 255,255, 0.3)',
                ],
            },
            boxShadow: {
                'smooth-low': `0px 0.3px 0.6px rgba(0, 0, 0, 0.02),
                0px 0.7px 1.3px rgba(0, 0, 0, 0.028),
                0px 1.3px 2.5px rgba(0, 0, 0, 0.035),
                0px 2.2px 4.5px rgba(0, 0, 0, 0.042),
                0px 4.2px 8.4px rgba(0, 0, 0, 0.05),
                0px 10px 20px rgba(0, 0, 0, 0.07)`,
                smooth: `0px 0.7px 0.7px rgba(0, 0, 0, 0.02),
                0px 1.7px 1.7px rgba(0, 0, 0, 0.028),
                0px 3.1px 3.1px rgba(0, 0, 0, 0.035),
                0px 5.6px 5.6px rgba(0, 0, 0, 0.042),
                0px 10.4px 10.4px rgba(0, 0, 0, 0.05),
                0px 25px 25px rgba(0, 0, 0, 0.07)`,
                'smooth-high': `0px 1.4px 1.4px rgba(0, 0, 0, 0.02),
                0px 3.3px 3.3px rgba(0, 0, 0, 0.028),
                0px 6.3px 6.3px rgba(0, 0, 0, 0.035),
                0px 11.2px 11.2px rgba(0, 0, 0, 0.042),
                0px 20.9px 20.9px rgba(0, 0, 0, 0.05),
                0px 50px 50px rgba(0, 0, 0, 0.07)`,
            },
        },
    },
    plugins: [],
};
export default config;
