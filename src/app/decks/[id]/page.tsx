import Button from '@/app/_components/Button';
import Flashcard from '@/app/_components/Flashcard';
import Panel from '@/app/_components/Panel';
import { createSSRClient } from '@/app/_lib/supabase';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { revalidatePath } from 'next/cache';

import DeckToggle from './DeckToggle';

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

        await supabase
            .from('decks')
            .update({ is_public: !checked })
            .eq('id', id)
            .select('*');

        revalidatePath(`/decks/${id}`);
    };

    return (
        <>
            <Panel padding="none">
                <div className="flex flex-row items-center justify-start gap-4 p-4 pb-0">
                    <div>
                        <h3 className="mb-4">{deck.data?.name}</h3>
                        <p className="text-subtle">{deck.data?.description}</p>
                    </div>
                    <Button intent="basic">
                        <PencilSquareIcon className="h-8 w-8" />
                    </Button>
                </div>
                <hr className="border-overlay" />
                <div className="flex flex-row p-4 pt-0">
                    <div className="flex flex-row">
                        <label className="mr-2">Private:</label>
                        <DeckToggle
                            checked={!deck.data?.is_public}
                            onChange={handleTogglePublic}
                        />
                    </div>
                </div>
            </Panel>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                {deckCards.data.map((card) => (
                    <li key={card.card_id}>
                        <Flashcard
                            front={card.card_front}
                            back={card.card_back}
                        ></Flashcard>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Deck;
