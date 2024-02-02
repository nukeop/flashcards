'use client';

import { Menu } from '@headlessui/react';
import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { FC } from 'react';

const contextMenuItem = cva(
    'flex w-full items-center justify-start px-2 py-1 text-xs',
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
                class: 'bg-stone-100 text-stone-600',
            },
            {
                intent: 'normal',
                active: false,
                class: 'text-stone-600',
            },
            {
                intent: 'warning',
                active: true,
                class: 'bg-red-100/50 text-red-500',
            },
            {
                intent: 'warning',
                active: false,
                class: 'text-stone-600',
            },
        ],
    },
);

const contextMenuItemIcon = cva('ml-1 mr-2 h-4 w-4', {
    variants: {
        intent: {
            warning: '',
            normal: 'text-stone-500',
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
        {
            intent: 'warning',
            active: false,
            class: 'text-stone-500',
        },
    ],
});

export type ContextMenuItemProps = {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
    Icon?: FC<{ className: string }>;
} & VariantProps<typeof contextMenuItem>;

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
    children,
    onClick,
    Icon,
    intent,
}) => {
    return (
        <Menu.Item>
            {({ active }) => (
                <button
                    className={clsx(contextMenuItem({ intent, active }))}
                    onClick={onClick}
                >
                    {Icon && (
                        <Icon
                            className={contextMenuItemIcon({
                                intent,
                                active,
                            })}
                        />
                    )}
                    {children}
                </button>
            )}
        </Menu.Item>
    );
};

export default ContextMenuItem;
