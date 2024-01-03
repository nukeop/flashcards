import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { beforeEach } from 'node:test';
import { beforeAll, describe, expect, it } from 'vitest';

const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}\+\d{2}:\d{2}/;
const uuidRegex = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/;

describe('decks', () => {
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

    it('should return public decks', async () => {
        const { data, error } = await supabase.from('decks').select('*');
        expect(error).toBeNull();
        data?.forEach((deck, index) => {
            expect(deck).toEqual({
                created_at: expect.stringMatching(dateRegex),
                description: 'Description for deck ' + (index + 1),
                id: expect.stringMatching(uuidRegex),
                name: 'Deck ' + (index + 1),
                public: true,
                updated_at: expect.stringMatching(dateRegex),
                user_id: expect.stringMatching(uuidRegex),
            });
        });
    });

    it('should not return private decks with anon key', async () => {
        const { data, error } = await supabase
            .from('decks')
            .select('*')
            .eq('public', false);
        expect(error).toBeNull();
        expect(data).toEqual([]);
    });

    it("should return a user's private decks with user key", async () => {
        const userId = await logIn('user1@example.com', 'password123');
        const { data } = await supabase
            .from('decks')
            .select('*')
            .eq('public', false)
            .eq('user_id', userId);

        expect(data).toEqual([
            {
                created_at: expect.stringMatching(dateRegex),
                description: 'Description for private deck',
                id: expect.stringMatching(uuidRegex),
                name: 'Private deck',
                public: false,
                updated_at: expect.stringMatching(dateRegex),
                user_id: userId,
            },
        ]);
    });

    it('should update the updated_at field when a deck is updated', async () => {
        const userId = await logIn('user1@example.com', 'password123');
        const { data } = await supabase
            .from('decks')
            .select('*')
            .eq('public', false)
            .eq('user_id', userId);
        const initialDate = data?.[0].updated_at;
        await supabase
            .from('decks')
            .update({ name: 'New name' })
            .eq('id', data?.[0].id);

        const { data: newData } = await supabase
            .from('decks')
            .select('*')
            .eq('public', false)
            .eq('user_id', userId);
        const newDate = newData?.[0].updated_at;

        expect(new Date(newDate).valueOf()).toBeGreaterThan(
            new Date(initialDate).valueOf(),
        );
    });

    const logIn = async (email: string, password: string) => {
        const { data } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return data?.user?.id;
    };
});
