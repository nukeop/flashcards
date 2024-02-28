import Button from '@/app/_components/Button';
import FlashcardEditorGrid from '@/app/_components/client-side/FlashcardEditorGrid';
import Input from '@/app/_components/client-side/Input';
import { HelpTooltip } from '@/app/_components/HelpTooltip';
import Panel from '@/app/_components/Panel';
import { fetchFlashcardsByDeckId } from '@/app/_data/flashcards';
import { createSSRClient } from '@/app/_lib/supabase';
import {
    MagnifyingGlassIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/outline';
import DeckToggle from './DeckToggle';

const Deck = async ({ params: { id } }: { params: { id: string } }) => {
    const supabase = createSSRClient();
    const user = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const deck = await supabase.from('decks').select('*').eq('id', id).single();

    const deckCards = await fetchFlashcardsByDeckId(id);

    if (!deckCards || !deckCards) {
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
                        <label className="mr-2 flex flex-row items-center">
                            <HelpTooltip content="Make your deck public to share it with others." />
                            Publish:
                        </label>
                        <DeckToggle
                            initialChecked={deck.data?.is_public}
                            deckId={id}
                        />
                    </div>
                </div>
            </Panel>

            <div className="flex flex-row">
                <Input
                    textSize="xs"
                    type="text"
                    placeholder="Search"
                    classes={{ root: 'mb-4' }}
                    prefix={<MagnifyingGlassIcon className="h-4 w-4" />}
                />
            </div>
            <FlashcardEditorGrid cards={deckCards} deckId={id} />
        </>
    );
};

export default Deck;
