import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { beforeEach } from 'node:test';
import { beforeAll, describe, expect, it } from 'vitest';

import { createLogIn, dateRegex, uuidRegex } from './test-utils';

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
                is_public: true,
                updated_at: expect.stringMatching(dateRegex),
                user_id: expect.stringMatching(uuidRegex),
            });
        });
    });

    it('should not return private decks with anon key', async () => {
        const { data, error } = await supabase
            .from('decks')
            .select('*')
            .eq('is_public', false);
        expect(error).toBeNull();
        expect(data).toEqual([]);
    });

    it("should return a user's private decks with user key", async () => {
        const userId = await logIn()('user1@example.com', 'password123');
        const { data } = await supabase
            .from('decks')
            .select('*')
            .eq('is_public', false)
            .eq('user_id', userId)
            .eq('name', 'Private deck');

        expect(data).toEqual([
            {
                created_at: expect.stringMatching(dateRegex),
                description: 'Description for private deck',
                id: expect.stringMatching(uuidRegex),
                name: 'Private deck',
                is_public: false,
                updated_at: expect.stringMatching(dateRegex),
                user_id: userId,
            },
        ]);
    });

    it('should update the updated_at field when a deck is updated', async () => {
        const userId = await logIn()('user1@example.com', 'password123');
        const { data } = await supabase
            .from('decks')
            .select('*')
            .eq('is_public', false)
            .eq('user_id', userId);
        const initialDate = data?.[0].updated_at;
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await supabase
            .from('decks')
            .update({ name: 'New name' })
            .eq('id', data?.[0].id);

        const { data: newData } = await supabase
            .from('decks')
            .select('*')
            .eq('is_public', false)
            .eq('user_id', userId);
        const newDate = newData?.[0].updated_at;

        expect(new Date(newDate).valueOf()).toBeGreaterThan(
            new Date(initialDate).valueOf(),
        );
    });

    it('should allow a user to create a deck', async () => {
        const userId = await logIn()('user1@example.com', 'password123');
        await supabase.from('decks').insert([
            {
                name: 'test deck',
                description: 'New deck description',
                is_public: false,
                user_id: userId,
            },
        ]);

        const { data: selectData } = await supabase
            .from('decks')
            .select('*')
            .eq('name', 'test deck');
        expect(selectData).toEqual([
            {
                id: expect.stringMatching(uuidRegex),
                description: 'New deck description',
                name: 'test deck',
                is_public: false,
                user_id: userId,
                updated_at: expect.stringMatching(dateRegex),
                created_at: expect.stringMatching(dateRegex),
            },
        ]);
    });

    it('should allow a user to delete his own deck', async () => {
        const userId = await logIn()('user1@example.com', 'password123');
        await supabase.from('decks').insert([
            {
                name: 'New deck',
                description: 'New deck description',
                is_public: false,
                user_id: userId,
            },
        ]);

        const { error } = await supabase
            .from('decks')
            .delete()
            .eq('name', 'New deck');
        expect(error).toBeNull();
        const { data } = await supabase
            .from('decks')
            .select('*')
            .eq('name', 'New deck');
        expect(data).toEqual([]);
    });

    it('should not allow a user to delete another user deck', async () => {
        await logIn()('user1@example.com', 'password123');

        await supabase.from('decks').delete().eq('name', 'Deck 2');
        await logIn()('user2@example.com', 'password123');
        const { data } = await supabase
            .from('decks')
            .select('*')
            .eq('name', 'Deck 2');

        expect(data).toEqual([
            expect.objectContaining({
                name: 'Deck 2',
            }),
        ]);
    });

    const logIn = () => createLogIn(supabase);
});
