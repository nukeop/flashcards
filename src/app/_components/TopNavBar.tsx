import Breadcrumbs from './client-side/Breadcrumbs';
import TopBarProfile from './client-side/TopBarProfile';

const TopNavBar = () => {
    return (
        <nav className="flex flex-row items-center flex-shrink-0 p-2 border-b border-highlight-high bg-surface">
            <div className="flex-grow-0 flex-shrink-0 ml-4 text-2xl font-bold">
                <a href="/">Flashcards</a>
            </div>
            <Breadcrumbs />
            <div className="flex-grow" />
            <TopBarProfile />
        </nav>
    );
};

export default TopNavBar;
