import Button from '@/app/_components/Button';
import Input from '@/app/_components/Input';
import Toggle from '@/app/_components/client-side/Toggle';
import { createSSRClient } from '@/app/_lib/supabase';
import { redirect } from 'next/navigation';

const NewDeck = () => {
    const handleNewDeck = async (formData: FormData) => {
        'use server';
        const rawFormData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            is_public: formData.get('public') === 'on',
        };

        const supabase = await createSSRClient();
        const userId = (await supabase.auth.getUser())?.data.user?.id;

        if (!userId) {
            return null;
        }

        await supabase.from('decks').insert({
            ...rawFormData,
            user_id: userId,
        });

        redirect('/decks');
    };

    return (
        <div className="grid grid-cols-[17%_66%_17%] w-full justify-center">
            <form
                action={handleNewDeck}
                method="post"
                className="flex flex-col gap-2 mx-auto bg-surface border border-muted/50 px-8 py-4 rounded-lg col-start-2"
            >
                <h1>Create a new deck</h1>
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
                    />
                    <Input
                        name="description"
                        placeholder="Deck description"
                        required
                        autoComplete="off"
                        label="Description"
                    />
                    <label className="flex flex-row gap-2 justify-start items-center">
                        <span>Public</span>
                        <Toggle defaultChecked={false} name="public" />
                    </label>
                    <div className="flex flex-row justify-end items-center">
                        <Button intent="green" type="submit">
                            Create deck
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewDeck;
