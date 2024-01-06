import {
    ArrowLeftStartOnRectangleIcon,
    BookOpenIcon,
    Square2StackIcon,
} from '@heroicons/react/24/outline';

import Button from './Button';

type SidebarProps = {
    content?: string;
};

const Sidebar: React.FC<SidebarProps> = () => {
    return (
        <header className="relative flex flex-col items-center gap-4 box-border m-4 px-2 py-4 bg-gradient-to-b from-base-contrast to-surface-contrast text-overlay rounded-lg flex-grow-0">
            <span>teste</span>
            <Button>
                <BookOpenIcon className="w-6 h-6" />
            </Button>

            <Button>
                <Square2StackIcon className="w-6 h-6" />
            </Button>
            <Button />

            <div className="flex-grow" />

            <Button>
                <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
            </Button>
        </header>
    );
};

export default Sidebar;
