import {
    ArrowLeftStartOnRectangleIcon,
    Square2StackIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

import Button from './Button';
import SidebarProfile from './SidebarProfile';
import Tooltip from './SidebarTooltip';

type SidebarProps = {
    content?: string;
};

const Sidebar: React.FC<SidebarProps> = () => {
    return (
        <header className="relative flex flex-col items-center gap-4 box-border m-4 px-2 py-4 bg-gradient-to-b from-base-contrast to-surface-contrast text-overlay rounded-lg flex-grow-0">
            <span>teste</span>
            <SidebarProfile />
            <Tooltip content="Decks">
                <Button intent="sidebar" as={Link} href="/decks">
                    <Square2StackIcon className="w-6 h-6" />
                </Button>
            </Tooltip>
            <div className="flex-grow" />

            <Tooltip content={<span>Log out</span>}>
                <Button intent="sidebar">
                    <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
                </Button>
            </Tooltip>
        </header>
    );
};

export default Sidebar;
