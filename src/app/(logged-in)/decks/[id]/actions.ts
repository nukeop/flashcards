'use server';

import { createSSRClient } from '@/app/_lib/supabase';

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
