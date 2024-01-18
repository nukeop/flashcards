import { Square2StackIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import Button from './Button';
import Tooltip from './Tooltip';

type SidebarProps = {
    content?: string;
};

const Sidebar: React.FC<SidebarProps> = () => {
    return (
        <header className="relative flex flex-col items-center gap-4 box-border my-4 ml-4 px-2 py-4 bg-gradient-to-b from-base-contrast to-overlay-contrast text-overlay rounded-lg flex-grow-0 z-10">
            <Tooltip content="Decks">
                <Button intent="sidebar" as={Link} href="/decks">
                    <Square2StackIcon className="w-6 h-6" />
                </Button>
            </Tooltip>
            <div className="flex-grow" />
        </header>
    );
};

export default Sidebar;
