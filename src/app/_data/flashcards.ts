'use server';

import { createSSRClient, doOrThrow } from '../_lib/supabase';

export const fetchFlashcardsByDeckId = async (deckId: string) => {
    const supabase = createSSRClient();
    return doOrThrow(
        supabase
            .from('flashcards')
            .select('*')
            .eq('deck_id', deckId)
            .order('position'),
        `Failed to fetch flashcards for deck ${deckId}`,
    );
};
