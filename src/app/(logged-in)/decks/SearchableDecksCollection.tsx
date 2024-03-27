'use client';

import Card from '@/app/_components/Card';
import Loader from '@/app/_components/Loader';
import { Deck } from '@/app/_lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DecksSearchBar from './DecksSearchBar';

type SearchableDecksCollectionProps = {
    isLoading: boolean;
    decks: Deck[];
};

const SearchableDecksCollection = ({
    isLoading,
    decks,
}: SearchableDecksCollectionProps) => {
    const [filteredDecks, setFilteredDecks] = useState(decks);

    useEffect(() => {
        setFilteredDecks(decks);
    }, [decks]);

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && (
                <>
                    <DecksSearchBar
                        onSearch={(searchTerm) => {
                            const lowerCaseSearchTerm =
                                searchTerm.toLowerCase();
                            setFilteredDecks(
                                decks.filter((deck) =>
                                    deck.name
                                        .toLowerCase()
                                        .includes(lowerCaseSearchTerm),
                                ),
                            );
                        }}
                    />
                    <div className="relative grid h-auto gap-4 rounded-lg sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {filteredDecks.map((deck) => {
                            return (
                                <Link href={`/decks/${deck.id}`} key={deck.id}>
                                    <Card fluid accent="violetpink">
                                        <h3 className="truncate">
                                            {deck.name}
                                        </h3>
                                        <p className="truncate">
                                            {deck.description}
                                        </p>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}
        </>
    );
};

export default SearchableDecksCollection;
