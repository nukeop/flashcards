import { useDecks } from '@/app/_hooks/useDecks';
import { ArrowUpOnSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import Loader from '../Loader';
import SidebarDeck from './SidebarDeck';
import SidebarLink from './SidebarLink';

const SidebarDecks = () => {
    const { decks, isLoading } = useDecks();
    return (
        <div className="flex flex-col">
            {isLoading && <Loader />}
            {decks.map((deck) => (
                <SidebarDeck key={deck.id} id={deck.id} name={deck.name} />
            ))}
            <SidebarLink
                className="flex flex-row items-center justify-end text-stone-400"
                href="/decks/new"
            >
                <PlusIcon className="h-4 w-4 text-stone-400" />
                New deck
            </SidebarLink>
            <SidebarLink
                className="flex flex-row items-center justify-end text-stone-400"
                href="/decks/import"
            >
                <ArrowUpOnSquareIcon className="h-4 w-4 text-stone-400" />
                Import
            </SidebarLink>
        </div>
    );
};

export default SidebarDecks;
