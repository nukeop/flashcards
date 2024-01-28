import Button from '@/app/_components/Button';
import Panel from '@/app/_components/Panel';
import { createSSRClient } from '@/app/_lib/supabase';
import { PencilSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import DeckToggle from './DeckToggle';
import FlashcardListItem from './FlashcardListItem';

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

    const handleNewCard = async () => {
        'use server';

        const supabase = createSSRClient();
        const { data, error } = await supabase
            .from('flashcards')
            .insert([
                {
                    deck_id: id[0],
                    front: 'Front',
                    back: 'Back',
                },
            ])
            .select()
            .single();

        if (error) {
            console.error(error);
        }

        if (data) {
            redirect(`/decks/${id[0]}/${data.id}`);
        }
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

            <div className="flex flex-grow flex-col items-center">
                <ul className="unordered-list max-w-[800px]">
                    {deckCards.data.map((card) => (
                        <FlashcardListItem
                            key={card.card_id}
                            card={card}
                            currentCardId={id[1]}
                            onDelete={async () => {
                                'use server';
                                const supabase = createSSRClient();

                                const { error } = await supabase
                                    .from('flashcards')
                                    .delete()
                                    .eq('id', card.card_id!);
                                if (error) {
                                    console.log(error);
                                } else {
                                    revalidatePath(`/decks/${id}`);
                                }
                            }}
                            onSave={async (front: string, back: string) => {
                                'use server';
                                const supabase = createSSRClient();

                                await supabase
                                    .from('flashcards')
                                    .update({
                                        front,
                                        back,
                                    })
                                    .eq('id', card.card_id!);
                            }}
                        />
                    ))}
                    <li>
                        <form action={handleNewCard}>
                            <Button
                                className="flex w-full cursor-pointer flex-row justify-center rounded border-2 border-dashed border-green-500 bg-green-500/25 p-4 text-green-700 shadow-md"
                                type="submit"
                            >
                                <PlusCircleIcon className="mr-2 h-6 w-6" /> Add
                                a new card
                            </Button>
                        </form>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Deck;
