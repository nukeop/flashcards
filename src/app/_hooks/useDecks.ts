import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useRxData } from 'rxdb-hooks';
import { Database } from '../_lib/database.types';
import { Deck } from '../_lib/types';

const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const useDecks = () => {
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
        (collection) => collection.find().where('user_id').equals(user?.id),
    );

    return { decks, isLoading: isFetching };
};
