'use client';

import { Transition } from '@headlessui/react';
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';
import Button from '../Button';
import SidebarDecks from './SidebarDecks';
import SidebarHeader from './SidebarHeader';

type SidebarProps = {
    show: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({}) => {
    const [show, setShow] = useState<boolean>(true);
    return (
        <>
            <Transition
                as="div"
                className="flex w-40 flex-col p-2 text-stone-500"
                show={show}
                enter="transform transition duration-500 ease-in-out"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition duration-500 ease-in-out"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
            >
                <Button intent="sidebar" onClick={() => setShow(!show)}>
                    <ChevronDoubleLeftIcon className="h-6 w-6" />
                </Button>
                <SidebarHeader>Study</SidebarHeader>
                <SidebarHeader>Decks</SidebarHeader>
                <SidebarDecks />
                <SidebarHeader>Community</SidebarHeader>
            </Transition>
            <Transition
                as="div"
                className="flex flex-col p-2 text-stone-500"
                show={!show}
                enter="transform transition duration-500 ease-in-out"
                enterFrom="opacity-0 translate-x-full w-0"
                enterTo="opacity-100 translate-x-0 w-auto"
                leave="transform transition duration-500 ease-in-out"
                leaveFrom="opacity-100 w-auto"
                leaveTo="opacity-0 w-0"
            >
                <Button intent="sidebar" onClick={() => setShow(!show)}>
                    <ChevronDoubleRightIcon className="h-6 w-6" />
                </Button>
            </Transition>
        </>
    );
};

export default Sidebar;
