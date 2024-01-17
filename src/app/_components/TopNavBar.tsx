import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';

import Button from './Button';
import Tooltip from './SidebarTooltip';
import TopBarProfile from './client-side/TopBarProfile';

const TopNavBar = () => {
    return (
        <nav className="flex flex-row items-center flex-shrink-0 p-2 border-b border-highlight-high bg-surface">
            {/* Logo text */}
            <div className="flex-grow-0 flex-shrink-0 ml-4 text-2xl font-bold">
                <a href="/">Flashcards</a>
            </div>
            <div className="flex-grow" />
            test
            <div className="flex-grow" />
            <TopBarProfile />
            <form
                className="flex items-center justify-center flex-grow-0"
                action="/auth/logout"
                method="post"
            >
                <Tooltip content={<span>Log out</span>}>
                    <Button type="submit">
                        <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
                    </Button>
                </Tooltip>
            </form>
        </nav>
    );
};

export default TopNavBar;
