'use client';

import Button from '@/app/_components/Button';
import ContextMenu from '@/app/_components/client-side/ContextMenu/ContextMenu';
import ContextMenuIconWrapper from '@/app/_components/client-side/ContextMenu/ContextMenuIconWrapper';
import FlashcardEditorGrid from '@/app/_components/client-side/FlashcardEditorGrid';
import { HelpTooltip } from '@/app/_components/HelpTooltip';
import Panel from '@/app/_components/Panel';
import { Database } from '@/app/_lib/database.types';
import { Deck as DeckType, Flashcard } from '@/app/_lib/types';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useRxData } from 'rxdb-hooks';
import DeckToggle from './DeckToggle';

const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const Deck = ({ params: { id } }: { params: { id: string } }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await supabase.auth.getUser();
            setUser(user.data.user);
        };

        fetchUser();
    }, []);

    const { result: deck } = useRxData<DeckType>('decks', (collection) =>
        collection.findOne(id),
    );

    const { result: deckCards } = useRxData<Flashcard>(
        'flashcards',
        (collection) =>
            collection.find().where('deck_id').eq(id).sort('position'),
    );
    const deckContextMenuItems = useMemo(
        () => [
            {
                label: 'Delete',
                Icon: ContextMenuIconWrapper(TrashIcon),
                onClick: async () => {
                    console.log(deck, deck[0]);
                    console.log(deck[0].toJSON());
                    await deck[0].remove();
                    try {
                        redirect('/decks');
                    } catch (error) {
                        console.error('Error deleting deck:', error);
                    }
                    // return console.log('Delete deck');
                },
            },
        ],
        [],
    );

    if (!deckCards || !deckCards) {
        return <div>Deck not found</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <Panel padding="none">
                <div className="flex flex-row items-center justify-start gap-1 px-4 py-1">
                    <div className="flex flex-grow flex-col">
                        <h3 className="flex flex-row items-center text-stone-600">
                            {deck[0].get('name')}
                            <Button
                                intent="iconButton"
                                className="ml-2 text-stone-600"
                            >
                                <PencilSquareIcon className="h-6 w-6" />
                            </Button>
                        </h3>
                        <p className="flex flex-row items-center text-sm text-stone-400">
                            {deck[0].get('description')}
                            <Button
                                intent="iconButton"
                                className="ml-2 text-stone-400"
                            >
                                <PencilSquareIcon className="h-4 w-4" />
                            </Button>
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row">
                            <label className="mr-2 flex flex-row items-center">
                                <HelpTooltip content="Make your deck public to share it with others." />
                                Publish:
                            </label>
                            <DeckToggle
                                initialChecked={deck[0].get('is_public')}
                                deckId={id}
                            />
                        </div>
                    </div>
                    <ContextMenu
                        positioning="standalone"
                        classes={{
                            menuIcon: 'h-6 w-6 text-stone-500',
                            items: 'top-16',
                        }}
                        items={deckContextMenuItems}
                    />
                </div>
            </Panel>

            <FlashcardEditorGrid cards={deckCards} deckId={id} />
        </>
    );
};

export default Deck;
