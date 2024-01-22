import Breadcrumbs from './client-side/Breadcrumbs';
import TopBarProfile from './client-side/TopBarProfile';

const TopNavBar = () => {
    return (
        <nav className="flex flex-shrink-0 flex-row items-center border-b border-muted/75 bg-surface p-2">
            <div className="ml-4 flex-shrink-0 flex-grow-0 text-2xl font-bold">
                <a href="/">Flashcards</a>
            </div>
            <Breadcrumbs />
            <div className="flex-grow" />
            <TopBarProfile />
        </nav>
    );
};

export default TopNavBar;
