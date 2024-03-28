'use client';

import { Database } from '@/app/_lib/database.types';
import { Deck } from '@/app/_lib/types';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useRxData } from 'rxdb-hooks';
import SearchableDecksCollection from './SearchableDecksCollection';

const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const DeckRetrievalWrapper = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await supabase.auth.getUser();
            setUser(user.data.user);
        };

        fetchUser();
    }, []);

    const { result: decks, isFetching } = useRxData<Deck>(
        'decks',
        (collection) => collection.find().where('user_id').eq(user?.id),
    );

    return (
        <SearchableDecksCollection
            isLoading={isFetching}
            decks={decks.map((deck) => deck.toJSON())}
        />
    );
};

export default DeckRetrievalWrapper;
