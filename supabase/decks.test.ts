import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { beforeAll, describe, expect, it } from 'vitest';

describe('decks', () => {
    let supabase: SupabaseClient;
    beforeAll(() => {
        const supabaseUrl = 'http://127.0.0.1:54321';
        const SUPABASE_KEY =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
        supabase = createClient(supabaseUrl, SUPABASE_KEY);
    });

    it('should return public decks', async () => {
        const { data, error } = await supabase.from('decks').select('*');
        expect(error).toBeNull();
        data?.forEach((deck, index) => {
            expect(deck).toEqual({
                created_at: expect.stringMatching(
                    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}\+\d{2}:\d{2}/,
                ),
                description: 'Description for deck ' + (index + 1),
                id: expect.stringMatching(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/),
                name: 'Deck ' + (index + 1),
                public: true,
                updated_at: expect.stringMatching(
                    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}\+\d{2}:\d{2}/,
                ),
                user_id: expect.stringMatching(
                    /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/,
                ),
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
});
