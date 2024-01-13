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
        <main className="relative flex-grow h-auto m-4 p-2 box-border">
            <h1 className="mb-4">Decks</h1>
            <DecksSearchBar />
            <div className="grid grid-cols-3 gap-4 relative h-auto rounded-lg">
                {decks?.data.map((deck) => {
                    return (
                        <Link href={`/decks/${deck.id}`} key={deck.id}>
                            <Card fluid accent="violetpink">
                                <div className="relative w-full h-full flex flex-col">
                                    <h3>{deck.name}</h3>
                                    <p>{deck.description}</p>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </main>
    );
};

export default Decks;
