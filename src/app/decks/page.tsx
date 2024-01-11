import Link from 'next/link';

import Card from '../_components/Card';
import { createSSRClient } from '../_lib/supabase';

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
        <div className="relative flex-grow h-auto m-4 box-border">
            <h1 className="mb-4">Decks</h1>
            <div className="grid relative bg-overlay p-2 h-auto rounded-lg">
                {decks?.data.map((deck) => {
                    return (
                        <Link href={`/decks/${deck.id}`} key={deck.id}>
                            <Card>
                                <h3>{deck.name}</h3>
                                <p>{deck.description}</p>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Decks;
