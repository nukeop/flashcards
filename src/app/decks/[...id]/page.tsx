import Button from '@/app/_components/Button';
import FlashcardEditor from '@/app/_components/FlashcardEditor';
import Panel from '@/app/_components/Panel';
import { createSSRClient } from '@/app/_lib/supabase';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import DeckToggle from './DeckToggle';

const Deck = async ({ params: { id } }: { params: { id: string[] } }) => {
    const supabase = createSSRClient();
    const user = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const deck = await supabase
        .from('decks')
        .select('*')
        .eq('id', id[0])
        .single();

    const deckCards = await supabase
        .from('deck_cards_view')
        .select('*')
        .eq('deck_id', id[0]);

    if (!deckCards || !deckCards.data) {
        return <div>Deck not found</div>;
    }

    const handleTogglePublic = async (checked: boolean) => {
        'use server';
        const supabase = createSSRClient();

        await supabase
            .from('decks')
            .update({ is_public: !checked })
            .eq('id', id[0])
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

            <div className="grid flex-grow grid-cols-1 gap-2 lg:grid-cols-3">
                <FlashcardEditor
                    className="col-span-2"
                    currentCard={deckCards.data.find(
                        (card) => card.card_id === id[1],
                    )}
                    onSave={async (front: string, back: string) => {
                        'use server';
                        const supabase = createSSRClient();

                        await supabase
                            .from('flashcards')
                            .update({
                                front,
                                back,
                            })
                            .eq('id', id[1]);
                    }}
                />

                <ul className="unordered-list">
                    {deckCards.data.map((card) => (
                        <Link
                            key={card.card_id}
                            href={`/decks/${card.deck_id}/${card.card_id}`}
                        >
                            <li
                                className={clsx(
                                    'hover: my-2 rounded border border-muted/75 bg-surface px-2 py-1 text-text transition-all duration-200 hover:border-muted hover:bg-overlay',
                                    {
                                        'border-accent/50 bg-accent/15 text-accent':
                                            card.card_id === id[1],
                                    },
                                )}
                            >
                                {card.card_front}
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Deck;
