import { createSSRClient } from '@/app/_lib/supabase';
import { revalidatePath } from 'next/cache';

export const handleNewCard =
    (deck_id: string) => async (formData: FormData) => {
        'use server';
        const front = formData.get('front');
        const back = formData.get('back');

        if (!front || !back) {
            return;
        }

        const supabase = createSSRClient();
        const { data, error } = await supabase
            .from('flashcards')
            .insert([
                {
                    deck_id,
                    front: String(front),
                    back: String(back),
                },
            ])
            .select()
            .single();

        if (error) {
            console.error(error);
        }

        if (data) {
            revalidatePath(`/decks/${deck_id}`);
        }
    };

export const handleTogglePublic =
    (deckId: string) => async (checked: boolean) => {
        'use server';
        const supabase = createSSRClient();

        await supabase
            .from('decks')
            .update({ is_public: !checked })
            .eq('id', deckId)
            .select('*');

        revalidatePath(`/decks/${deckId}`);
    };
