import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createLogIn, dateRegex, uuidRegex } from './test-utils';

describe('flashcards', () => {
    let supabase: SupabaseClient;
    beforeAll(() => {
        const supabaseUrl = 'http://127.0.0.1:54321';
        const SUPABASE_KEY =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
        supabase = createClient(supabaseUrl, SUPABASE_KEY);
    });

    beforeEach(async () => {
        supabase.auth.signOut();
    });

    it('should allow anon users to view cards in public decks', async () => {
        const { data: deck } = await supabase
            .from('decks')
            .select('*')
            .eq('name', 'Deck 1')
            .single();
        const { data: card, error } = await supabase
            .from('flashcards')
            .select('*')
            .eq('deck_id', deck.id)
            .single();

        console.log(error);
        expect(error).toBeNull();
        expect(card).toEqual({
            id: expect.stringMatching(uuidRegex),
            deck_id: deck.id,
            front: 'Front 1',
            back: 'Back 1',
            created_at: expect.stringMatching(dateRegex),
            updated_at: expect.stringMatching(dateRegex),
        });
    });
    const logIn = () => createLogIn(supabase);
});
