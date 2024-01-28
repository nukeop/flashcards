import { Square2StackIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Button from './Button';
import Tooltip from './Tooltip';

type SidebarProps = {
    content?: string;
};

const Sidebar: React.FC<SidebarProps> = () => {
    return (
        <header className="relative z-10 my-4 ml-4 box-border flex flex-grow-0 flex-col items-center gap-4 rounded-lg bg-gradient-to-b from-base-contrast to-overlay-contrast px-2 py-4 text-overlay">
            <Tooltip content="Decks">
                <Button intent="sidebar" as={Link} href="/decks">
                    <Square2StackIcon className="h-6 w-6" />
                </Button>
            </Tooltip>
            <div className="flex-grow" />
        </header>
    );
};

export default Sidebar;
