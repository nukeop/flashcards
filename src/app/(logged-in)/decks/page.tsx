import { Metadata } from 'next';
import { createSSRClient } from '../../_lib/supabase';
import DeckRetrievalWrapper from './DeckRetrievalWrapper';

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

    return (
        <>
            <h1 className="mb-4">Decks</h1>
            <DeckRetrievalWrapper />
        </>
    );
};

export default Decks;
