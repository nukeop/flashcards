import { Metadata } from 'next';
import { createSSRClient } from '../../_lib/supabase';
import SearchableDecksCollection from './SearchableDecksCollection';

export const metadata: Metadata = {
    title: 'Decks',
    description: 'Your decks',
};

const Decks = async () => {
    const supabase = createSSRClient();
    const user = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const decks = await supabase
        .from('decks')
        .select('*')
        .eq('user_id', user.data.user?.id || '');

    if (!decks || !decks.data) {
        return null;
    }

    return (
        <>
            <h1 className="mb-4">Decks</h1>
            <SearchableDecksCollection decks={decks.data} />
        </>
    );
};

export default Decks;
