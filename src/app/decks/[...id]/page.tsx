import Button from '@/app/_components/Button';
import FlashcardEditorGrid from '@/app/_components/client-side/FlashcardEditorGrid';
import Panel from '@/app/_components/Panel';
import { createSSRClient } from '@/app/_lib/supabase';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import DeckToggle from './DeckToggle';
import { handleNewCard, handleTogglePublic } from './inline-actions';

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

    return (
        <>
            <Panel padding="none">
                <div className="flex flex-row items-center justify-start gap-2 px-4 py-2">
                    <div className="flex flex-grow flex-col">
                        <h3 className="flex flex-row items-center">
                            {deck.data?.name}
                            <Button className="ml-2 text-stone-600">
                                <PencilSquareIcon className="h-6 w-6" />
                            </Button>
                        </h3>
                        <p className="flex flex-row items-center text-stone-500">
                            {deck.data?.description}
                            <Button className="ml-2 text-stone-500">
                                <PencilSquareIcon className="h-4 w-4" />
                            </Button>
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <label className="mr-2">Private:</label>
                        <DeckToggle
                            checked={!deck.data?.is_public}
                            onChange={handleTogglePublic(id[0])}
                        />
                    </div>
                </div>
            </Panel>

            <FlashcardEditorGrid
                cards={deckCards.data}
                onCreateFlashcard={handleNewCard(id[0])}
            />
            {/* <ul className="unordered-list max-w-[800px]">
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
                </ul> */}
        </>
    );
};

export default Deck;
