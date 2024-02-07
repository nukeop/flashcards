import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.scss';
import { Providers } from './providers';

const font = Figtree({
    style: 'normal',
    weight: ['400', '700'],
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        template: '%s | Flashcards',
        default: 'Flashcards',
    },
    description: 'Learn anything with flashcards',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={font.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
