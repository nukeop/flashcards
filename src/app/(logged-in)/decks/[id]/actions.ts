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
