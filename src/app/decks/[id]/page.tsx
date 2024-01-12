import { createSSRClient } from '@/app/_lib/supabase';

const Deck = async ({ params: { id } }: { params: { id: string } }) => {
    const supabase = createSSRClient();
    const user = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const deck = await supabase.from('decks').select('*').eq('id', id).single();

    if (!deck || !deck.data) {
        return <div>Deck not found</div>;
    }

    return (
        <div className="relative flex-grow h-auto m-4 box-border">
            <h1 className="mb-4">Deck</h1>
            <h2 className="mb-4">{deck.data.name}</h2>
            <p>{deck.data.description}</p>
        </div>
    );
};

export default Deck;
