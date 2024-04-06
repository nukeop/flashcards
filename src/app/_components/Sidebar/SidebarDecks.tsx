import { useDecks } from '@/app/_hooks/useDecks';
import Loader from '../Loader';
import SidebarDeck from './SidebarDeck';

const SidebarDecks = () => {
    const { decks, isLoading } = useDecks();
    return (
        <div className="flex flex-col">
            {isLoading && <Loader />}
            {decks.map((deck) => (
                <SidebarDeck key={deck.id} id={deck.id} name={deck.name} />
            ))}
        </div>
    );
};

export default SidebarDecks;
