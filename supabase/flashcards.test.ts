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

    it('should allow logged in users to insert new cards into their own decks', async () => {
        await logIn()('user1@example.com', 'password123');
        const { data: deckData } = await supabase
            .from('decks')
            .select('id,user_id')
            .eq('name', 'Deck 1');

        const { data: cardData, error: cardError } = await supabase
            .from('flashcards')
            .insert([
                {
                    deck_id: (deckData![0] as { id: string }).id,
                    front: 'test front',
                    back: 'test back',
                },
            ])
            .select();
        console.log(cardData, cardError);
        expect(cardError).toBeNull();
        expect(cardData).toEqual([
            {
                id: expect.stringMatching(uuidRegex),
                deck_id: (deckData![0] as { id: string }).id,
                front: 'test front',
                back: 'test back',
                created_at: expect.stringMatching(dateRegex),
                updated_at: expect.stringMatching(dateRegex),
            },
        ]);

        await supabase.from('flashcards').delete().eq('id', cardData![0].id);
        await supabase.from('decks').delete().eq('id', deckData![0].id);
    });

    it('should not allow anon users to view cards in private decks', async () => {
        const userId = await logIn()('user1@example.com', 'password123');
        const { data: deckData } = await supabase
            .from('decks')
            .insert([
                {
                    name: 'My private deck',
                    description: 'New deck description',
                    is_public: false,
                    user_id: userId,
                },
            ])
            .select();

        const { data: cardData, error: cardError } = await supabase
            .from('flashcards')
            .insert([
                {
                    deck_id: (deckData![0] as { id: string }).id,
                    front: 'test front',
                    back: 'test back',
                },
            ])
            .select();
        console.log(cardData, cardError);

        await supabase.auth.signOut();
        const { data, error } = await supabase
            .from('flashcards')
            .select('*')
            .eq('id', (cardData![0] as { id: string }).id)
            .single();

        expect(error).toBeNull();
        expect(data).toEqual([]);
    });

    const logIn = () => createLogIn(supabase);
});
