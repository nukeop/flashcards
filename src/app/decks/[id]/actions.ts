'use server';

import { createSSRClient } from '@/app/_lib/supabase';
import { revalidatePath } from 'next/cache';

export const handleTogglePublic = async (checked: boolean, deckId: string) => {
    const supabase = createSSRClient();

    const { data } = await supabase
        .from('decks')
        .update({ is_public: checked })
        .eq('id', deckId)
        .select('*')
        .single();

    return data;
};

export const handleNewCard = async (formData: FormData, deck_id: string) => {
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

export const handleDelete = async (flashcardId: string, deckId: string) => {
    const supabase = createSSRClient();

    const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', flashcardId);

    if (error) {
        console.log(error);
    } else {
        revalidatePath(`/decks/${deckId}`);
    }
};
