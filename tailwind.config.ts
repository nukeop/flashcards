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
                'nier-red': {
                    50: '#FDF4F2',
                    100: '#FAE9E5',
                    200: '#F5D2CC',
                    300: '#EFB5A9',
                    400: '#E7907E',
                    500: '#DC5E45',
                    600: '#D74528',
                    700: '#BD3D24',
                    800: '#96311C',
                    900: '#742616',
                    950: '#49180E',
                },
                'nier-cyan': {
                    50: '#D6FFFC',
                    100: '#A3FFF7',
                    200: '#00FAE5',
                    300: '#00E0CE',
                    400: '#00CCBB',
                    500: '#00AC9F',
                    600: '#009E91',
                    700: '#008A7E',
                    800: '#007067',
                    900: '#004D46',
                    950: '#003833',
                },
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
