import { createSSRClient } from '@/app/_lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const handleNewCard = (id: string) => async (formData: FormData) => {
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
                deck_id: id,
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
        redirect(`/decks/${id}/${data.id}`);
    }
};

export const handleTogglePublic = (id: string) => async (checked: boolean) => {
    'use server';
    const supabase = createSSRClient();

    await supabase
        .from('decks')
        .update({ is_public: !checked })
        .eq('id', id)
        .select('*');

    revalidatePath(`/decks/${id}`);
};
