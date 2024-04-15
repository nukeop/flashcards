import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';

type SidebarLinkProps = {
    'data-testid'?: string;
    className?: string;
    isActive?: boolean;
    href: string;
    children?: React.ReactNode;
};

const sidebarLink = cva('flex items-center px-2 py-1 text-sm text-stone-600', {
    variants: {
        isActive: {
            true: 'rounded bg-stone-200 hover:bg-stone-300/75',
            false: 'hover:bg-stone-200/50',
        },
    },
});

const SidebarLink: FC<SidebarLinkProps> = ({
    'data-testid': testId = 'sidebar-link',
    isActive = false,
    className,
    href,
    children,
}) => {
    return (
        <Link
            data-testid={testId}
            className={clsx(sidebarLink({ isActive }), className)}
            href={href}
        >
            {children}
        </Link>
    );
};

export default SidebarLink;
