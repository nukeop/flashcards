'use server';

import { createSSRClient } from '@/app/_lib/supabase';
import { revalidatePath } from 'next/cache';

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
