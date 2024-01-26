import Button from '@/app/_components/Button';
import FlashcardEditor from '@/app/_components/FlashcardEditor';
import Panel from '@/app/_components/Panel';
import { createSSRClient } from '@/app/_lib/supabase';
import {
    ChevronDownIcon,
    PencilSquareIcon,
    PlusCircleIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
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
                <div className="flex flex-row items-center justify-start gap-2 px-4 py-2">
                    <div className="flex flex-grow flex-col">
                        <h3 className=" flex flex-row items-center">
                            {deck.data?.name}
                            <Button className="ml-2 text-muted">
                                <PencilSquareIcon className="h-6 w-6" />
                            </Button>
                        </h3>
                        <p className="flex flex-row items-center text-subtle">
                            {deck.data?.description}
                            <Button className="ml-2 text-subtle">
                                <PencilSquareIcon className="h-4 w-4" />
                            </Button>
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <label className="mr-2">Private:</label>
                        <DeckToggle
                            checked={!deck.data?.is_public}
                            onChange={handleTogglePublic}
                        />
                    </div>
                </div>
            </Panel>

            <div className="flex flex-grow flex-col">
                {/* <FlashcardEditor
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
                /> */}

                <ul className="unordered-list">
                    {deckCards.data.map((card) => (
                        <Panel
                            as="li"
                            key={card.card_id}
                            className={clsx(
                                'hover: group my-2 flex flex-row items-center rounded border border-slate-200 bg-white px-3 py-3 text-text shadow ',
                                {
                                    'border-indigo-400 bg-indigo-50 text-stone-600':
                                        card.card_id === id[1],
                                },
                            )}
                            hoverEffect
                        >
                            <div className="flex flex-grow flex-col">
                                <div className="flex flex-row items-center justify-start">
                                    <Link
                                        key={card.card_id}
                                        href={`/decks/${card.deck_id}/${card.card_id}`}
                                    >
                                        <Button className="mr-2 flex h-10 w-10 items-center justify-center p-0">
                                            <ChevronDownIcon className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <span className="cursor-default">
                                        {card.card_front}
                                    </span>
                                    <span className="flex-grow" />
                                    <Button
                                        className="ml-2 hidden h-10 w-10 text-muted shadow group-hover:flex"
                                        onClick={async () => {
                                            'use server';
                                            const supabase = createSSRClient();

                                            const { error } = await supabase
                                                .from('flashcards')
                                                .delete()
                                                .eq('id', id[1]);
                                            if (error) {
                                                console.log(error);
                                            }
                                        }}
                                    >
                                        <TrashIcon className="h-6 w-6" />
                                    </Button>
                                </div>
                                {card.card_id === id[1] && (
                                    <FlashcardEditor
                                        className="col-span-2 mt-2"
                                        currentCard={deckCards.data.find(
                                            (card) => card.card_id === id[1],
                                        )}
                                        onSave={async (
                                            front: string,
                                            back: string,
                                        ) => {
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
                                )}
                            </div>
                        </Panel>
                    ))}
                    <li className="flex cursor-pointer flex-row justify-center rounded border-2 border-dashed border-green-500 bg-green-500/25 p-4 text-green-700 shadow-md">
                        <PlusCircleIcon className="mr-2 h-6 w-6" /> Add a new
                        card
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Deck;
