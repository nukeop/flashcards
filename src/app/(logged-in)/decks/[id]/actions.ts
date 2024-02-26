'use server';

import { fetchFlashcardsByDeckId } from '@/app/_data/flashcards';
import { createSSRClient, doOrThrow } from '@/app/_lib/supabase';
import { Flashcard } from '@/app/_lib/types';

export const handleTogglePublicDeck = async (
    checked: boolean,
    deckId: string,
) => {
    const supabase = createSSRClient();

    const { data } = await supabase
        .from('decks')
        .update({ is_public: checked })
        .eq('id', deckId)
        .select('*')
        .single();

    return data;
};

export const handleNewFlashcard = async (
    formData: FormData,
    deck_id: string,
) => {
    const front = formData.get('front');
    const back = formData.get('back');

    if (!front || !back) {
        return;
    }

    const supabase = createSSRClient();
    const { data: nextPositionIndex, error: getNextCardPositionError } =
        await supabase.rpc('get_next_card_position', {
            deck_id_arg: deck_id,
        });

    if (getNextCardPositionError) {
        console.error(getNextCardPositionError);
        throw new Error('Failed to get next card position');
    }

    const { data, error } = await supabase
        .from('flashcards')
        .insert([
            {
                deck_id,
                front: String(front),
                back: String(back),
                position: nextPositionIndex,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error(error);
    }

    return data;
};

export const handleEditFlashcard = async (
    formData: FormData,
    flashcardId: string,
) => {
    const front = formData.get('front');
    const back = formData.get('back');

    if (!front || !back) {
        return;
    }

    const supabase = createSSRClient();
    const { data, error } = await supabase
        .from('flashcards')
        .update({ front: String(front), back: String(back) })
        .eq('id', flashcardId)
        .select()
        .single();

    if (error) {
        console.error(error);
    }

    return data;
};

export const handleDeleteFlashcard = async (flashcardId: string) => {
    const supabase = createSSRClient();

    const { data, error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', flashcardId);

    if (error) {
        console.error(error);
        throw new Error('Failed to delete flashcard');
    } else {
        return data;
    }
};

export const handleReorderFlashcards = async (
    updatedCards: Flashcard[],
    deckId: string,
) => {
    const supabase = createSSRClient();

    await doOrThrow(
        supabase.rpc('update_card_positions', {
            card_ids: updatedCards.map((card) => card.id),
            new_positions: [...Array(updatedCards.length).keys()],
        }),
        'Failed to reorder flashcards',
    );

    return fetchFlashcardsByDeckId(deckId);
};
