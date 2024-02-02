'use client';

import { Menu } from '@headlessui/react';
import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { ReactNode } from 'react';

const contextMenuItem = cva(
    'flex w-full items-center justify-start px-2 py-1 text-xs text-stone-600',
    {
        variants: {
            intent: {
                warning: '',
                normal: '',
            },
            active: {
                true: '',
            },
        },
        defaultVariants: {
            intent: 'normal',
        },
        compoundVariants: [
            {
                intent: 'normal',
                active: true,
                class: 'bg-stone-100',
            },
            {
                intent: 'warning',
                active: true,
                class: 'bg-red-100/50 text-red-500',
            },
        ],
    },
);

const contextMenuItemIcon = cva('ml-1 mr-2 text-stone-400', {
    variants: {
        intent: {
            warning: '',
            normal: '',
        },
        active: {
            true: '',
        },
    },
    defaultVariants: {
        intent: 'normal',
    },
    compoundVariants: [
        {
            intent: 'warning',
            active: true,
            class: 'text-red-500',
        },
    ],
});

export type ContextMenuItemProps = {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
    icon?: ReactNode;
} & VariantProps<typeof contextMenuItem>;

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
    children,
    onClick,
    icon,
    intent,
}) => {
    return (
        <Menu.Item>
            {({ active }) => (
                <button
                    className={clsx(contextMenuItem({ intent, active }))}
                    onClick={onClick}
                >
                    {icon && (
                        <span
                            className={contextMenuItemIcon({ intent, active })}
                        >
                            {icon}
                        </span>
                    )}
                    {children}
                </button>
            )}
        </Menu.Item>
    );
};

export default ContextMenuItem;
