import TopBarProfile from './client-side/TopBarProfile';

const TopNavBar = () => {
    return (
        <nav className="relative flex flex-shrink-0 flex-row items-center justify-start border-b border-blue-600 bg-blue-500 px-4 py-1 text-white shadow-md">
            <div className="inline flex-shrink-0 flex-grow-0 text-2xl font-bold">
                <a href="/">Flashcards</a>
            </div>
            <div className="flex-grow" />
            <TopBarProfile />
        </nav>
    );
};

export default TopNavBar;
