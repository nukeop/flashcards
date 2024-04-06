'use client';

import { useDecks } from '@/app/_hooks/useDecks';
import SearchableDecksCollection from './SearchableDecksCollection';

const DeckRetrievalWrapper = () => {
    const { decks, isLoading } = useDecks();
    return (
        <SearchableDecksCollection
            isLoading={isLoading}
            decks={decks.map((deck) => deck.toJSON())}
        />
    );
};

export default DeckRetrievalWrapper;
