import Link from 'next/link';

import Card from '../_components/Card';
import { createSSRClient } from '../_lib/supabase';
import DecksSearchBar from './DecksSearchBar';

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
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 relative h-auto rounded-lg">
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
