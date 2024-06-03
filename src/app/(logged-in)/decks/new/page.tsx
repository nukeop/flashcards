'use client';

import Button from '@/app/_components/Button';
import Input from '@/app/_components/client-side/Input';
import Toggle from '@/app/_components/client-side/Toggle';
import { HelpTooltip } from '@/app/_components/HelpTooltip';
import { useUser } from '@/app/_hooks/useUser';
import { Deck as DeckType } from '@/app/_lib/types';
import { redirect } from 'next/navigation';
import { useRxCollection } from 'rxdb-hooks';
import { v4 } from 'uuid';

const NewDeck = () => {
    const { session } = useUser();
    const decksCollection = useRxCollection<DeckType>('decks');

    const handleNewDeck = async (formData: FormData) => {
        const rawFormData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            is_public: formData.get('public') === 'on',
        };
        await decksCollection?.insert({
            ...rawFormData,
            id: v4(),
            user_id: session!.user.id!,
            created_at: new Date().toISOString(),
            _modified: new Date().toISOString(),
            _deleted: false,
        });
        redirect('/decks');
    };

    return (
        <div className="grid w-full grid-cols-[17%_66%_17%] justify-center">
            <form
                action={handleNewDeck}
                method="post"
                className="col-start-2 mx-auto flex flex-col gap-2 rounded-lg border border-stone-300 bg-stone-50 px-8 py-4"
            >
                <h1 className="text-stone-600">Create a new deck</h1>
                <p className="text-muted">
                    A deck is a collection of cards about a specific topic.
                </p>
                <hr />
                <div className="flex flex-col gap-4">
                    <Input
                        name="name"
                        placeholder="Deck name"
                        required
                        autoFocus
                        autoComplete="off"
                        label="Name"
                        fluid={false}
                    />
                    <Input
                        name="description"
                        placeholder="Deck description"
                        required
                        autoComplete="off"
                        label="Description"
                        fluid={false}
                    />
                    <label className="flex flex-row items-center justify-start gap-2">
                        <label className="flex flex-row items-center">
                            <HelpTooltip content="Make your deck public to share it with others." />
                            Publish:
                        </label>
                        <Toggle defaultChecked={false} name="public" />
                    </label>
                    <div className="flex flex-row items-center justify-end">
                        <Button intent="primary" type="submit">
                            Create deck
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewDeck;
