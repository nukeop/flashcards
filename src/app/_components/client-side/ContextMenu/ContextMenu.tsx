import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Fragment, ReactNode } from 'react';
import Button from '../../Button';
import ContextMenuItem, { ContextMenuItemProps } from './ContextMenuItem';

type ContextMenuProps = {
    classes?: Partial<{
        root: string;
        button: string;
        items: string;
    }>;
    items: {
        label: ReactNode;
        Icon?: ContextMenuItemProps['Icon'];
        intent?: ContextMenuItemProps['intent'];
        onClick?: ContextMenuItemProps['onClick'];
    }[];
};

const ContextMenu: React.FC<ContextMenuProps> = ({ items }) => {
    return (
        <Menu>
            <Menu.Button
                as={Button}
                intent="secondary"
                className="absolute right-1 top-1 z-10 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100"
            >
                <EllipsisVerticalIcon className="h-5 w-5" />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100 z-30"
                leave="transition duration-100 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Menu.Items className="absolute right-0 top-10 z-30 min-w-48 rounded border border-stone-300 bg-stone-50 py-1 shadow-smooth">
                    {items.map((item, index) => (
                        <ContextMenuItem key={index} {...item}>
                            {item.label}
                        </ContextMenuItem>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default ContextMenu;
