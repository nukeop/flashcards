import Button from '@/app/_components/Button';
import Card from '@/app/_components/Card';
import Toggle from '@/app/_components/Toggle';
import { createSSRClient } from '@/app/_lib/supabase';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

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

    const handleTogglePublic = async (checked: boolean) => {
        'use server';
        const supabase = createSSRClient();

        const { data, error } = await supabase
            .from('decks')
            .update({ is_public: !checked })
            .eq('id', id);
    };

    return (
        <main className="relative flex-grow h-auto m-4 p-2 box-border">
            <div className="bg-surface border-t border-b border-accent/25 mb-8">
                <div className="flex flex-row items-center justify-start gap-4 px-2 pt-4">
                    <div>
                        <h3 className="mb-4">{deck.data?.name}</h3>
                        <p className="text-subtle">{deck.data?.description}</p>
                    </div>
                    <Button intent="basic">
                        <PencilSquareIcon className="w-8 h-8" />
                    </Button>
                </div>
                <hr className="border-overlay" />
                <div className="flex flex-row p-2 pb-4">
                    <div className="flex flex-row">
                        <label className="mr-2">Private:</label>
                        <Toggle
                            checked={!deck.data?.is_public}
                            onChange={handleTogglePublic}
                        />
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
