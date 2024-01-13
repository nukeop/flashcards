import Card from '@/app/_components/Card';
import { createSSRClient } from '@/app/_lib/supabase';

const Deck = async ({ params: { id } }: { params: { id: string } }) => {
    const supabase = createSSRClient();
    const user = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const deck = await supabase.from('decks').select('*').eq('id', id).single();

    const deckCards = await supabase
        .from('deck_cards_view')
        .select('*')
        .eq('deck_id', id);

    if (!deckCards || !deckCards.data) {
        return <div>Deck not found</div>;
    }

    return (
        <main className="relative flex-grow h-auto m-4 p-2 box-border">
            <div className="bg-surface border-t border-b border-accent/25 mb-8">
                <div className="px-2 pt-4">
                    <h3 className="mb-4">{deck.data?.name}</h3>
                    <p className="text-subtle">{deck.data?.description}</p>
                </div>
                <hr className="border-overlay" />
                <div className="flex flex-row p-2 pb-4">
                    <div className="flex flex-row">
                        <label className="mr-2">Private:</label>
                        <input type="checkbox" checked={!deck.data?.public} />
                    </div>
                </div>
            </div>
            <ul className="grid grid-cols-3">
                {deckCards.data.map((card) => (
                    <li key={card.card_id}>
                        <Card fluid accent="violetpink">
                            <div className="relative w-full h-full flex flex-col">
                                <h3>{card.card_front}</h3>
                                <p>{card.card_back}</p>
                            </div>
                        </Card>
                    </li>
                ))}
            </ul>
        </main>
    );
};

export default Deck;
