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
                'smooth-low': `0px 0.4px 2.2px rgba(0, 0, 0, 0.02),
                    0px 1.1px 5.3px rgba(0, 0, 0, 0.028),
                    0px 2px 10px rgba(0, 0, 0, 0.035),
                    0px 3.6px 17.9px rgba(0, 0, 0, 0.042),
                    0px 6.7px 33.4px rgba(0, 0, 0, 0.05),                  
                    0px 16px 80px rgba(0, 0, 0, 0.07)`,
                smooth: `0px 1.8px 2.2px rgba(0, 0, 0, 0.02),
                0px 4.3px 5.3px rgba(0, 0, 0, 0.028),
                0px 8px 10px rgba(0, 0, 0, 0.035),
                0px 14.3px 17.9px rgba(0, 0, 0, 0.042),
                0px 26.7px 33.4px rgba(0, 0, 0, 0.05),
                0px 64px 80px rgba(0, 0, 0, 0.07)`,
                'smooth-high': `0px 2.7px 2.2px rgba(0, 0, 0, 0.02),
                0px 6.4px 5.3px rgba(0, 0, 0, 0.028),
                0px 12px 10px rgba(0, 0, 0, 0.035),
                0px 21.4px 17.9px rgba(0, 0, 0, 0.042),
                0px 40.1px 33.4px rgba(0, 0, 0, 0.05),
                0px 96px 80px rgba(0, 0, 0, 0.07)`,
            },
        },
    },
    plugins: [],
};
export default config;
