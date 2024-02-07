import { Metadata } from 'next';
import Link from 'next/link';
import Card from '../../_components/Card';
import { createSSRClient } from '../../_lib/supabase';
import DecksSearchBar from './DecksSearchBar';

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
            <DecksSearchBar />
            <div className="relative grid h-auto gap-4 rounded-lg sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {decks?.data.map((deck) => {
                    return (
                        <Link href={`/decks/${deck.id}`} key={deck.id}>
                            <Card fluid accent="violetpink">
                                <h3 className="truncate">{deck.name}</h3>
                                <p className="truncate">{deck.description}</p>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </>
    );
};

export default Decks;
