import { beforeEach } from 'node:test';
import { beforeAll, describe, expect, it } from 'vitest';

import { TestFixture, dateRegex, uuidRegex } from './test-utils';

describe('decks', () => {
    beforeAll(() => {
        TestFixture.initialize();
    });

    beforeEach(async () => {
        await TestFixture.logOut();
    });

    it('should return public decks', async () => {
        const { data, error } = await TestFixture.getClient()
            .from('decks')
            .select('*');
        expect(error).toBeNull();
        expect(data?.length).toBe(10);
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
        await TestFixture.logIn('user1@example.com', 'password123');
        const { data, error } = await TestFixture.getClient()
            .from('decks')
            .select('*')
            .eq('name', 'Private deck');

        expect(error).toBeNull();
        expect(data).toEqual([
            expect.objectContaining({ name: 'Private deck' }),
        ]);

        await TestFixture.getClient().auth.signOut();

        const { data: anonData, error: anonError } =
            await TestFixture.getClient()
                .from('decks')
                .select('*')
                .eq('name', 'Private deck');
        expect(anonError).toBeNull();
        expect(anonData).toEqual([]);
    });

    it('should return public decks with user key', async () => {
        await TestFixture.logIn('user2@example.com', 'password123');
        const { data, error } = await TestFixture.getClient()
            .from('decks')
            .select('*');

        expect(error).toBeNull();
        expect(data?.length).toBe(10);
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

    it("should return a user's private decks with user key", async () => {
        const userId = await TestFixture.logIn(
            'user1@example.com',
            'password123',
        );
        const { data } = await TestFixture.getClient()
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
        const userId = await TestFixture.logIn(
            'user1@example.com',
            'password123',
        );
        const { data } = await TestFixture.getClient()
            .from('decks')
            .select('*')
            .eq('is_public', false)
            .eq('user_id', userId);
        const initialDate = data?.[0].updated_at;

        await TestFixture.getClient()
            .from('decks')
            .update({ name: 'New name' })
            .eq('id', data?.[0].id);

        const { data: newData } = await TestFixture.getClient()
            .from('decks')
            .select('*')
            .eq('is_public', false)
            .eq('user_id', userId);
        const newDate = newData?.[0].updated_at;

        expect(new Date(newDate).valueOf()).toBeGreaterThan(
            new Date(initialDate).valueOf(),
        );

        await TestFixture.getClient()
            .from('decks')
            .update({ name: 'Private deck' })
            .eq('id', data?.[0].id);
    });

    it('should allow a user to create a deck', async () => {
        const userId = await TestFixture.logIn(
            'user1@example.com',
            'password123',
        );
        await TestFixture.getClient()
            .from('decks')
            .insert([
                {
                    name: 'test deck',
                    description: 'New deck description',
                    is_public: false,
                    user_id: userId,
                },
            ]);

        const { data: selectData } = await TestFixture.getClient()
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
        const userId = await TestFixture.logIn(
            'user1@example.com',
            'password123',
        );
        await TestFixture.getClient()
            .from('decks')
            .insert([
                {
                    name: 'New deck',
                    description: 'New deck description',
                    is_public: false,
                    user_id: userId,
                },
            ]);

        const { error } = await TestFixture.getClient()
            .from('decks')
            .delete()
            .eq('name', 'New deck');
        expect(error).toBeNull();
        const { data } = await TestFixture.getClient()
            .from('decks')
            .select('*')
            .eq('name', 'New deck');
        expect(data).toEqual([]);
    });

    it('should not allow a user to delete another user deck', async () => {
        await TestFixture.logIn('user1@example.com', 'password123');

        await TestFixture.getClient()
            .from('decks')
            .delete()
            .eq('name', 'Deck 2');
        await TestFixture.logIn('user2@example.com', 'password123');
        const { data } = await TestFixture.getClient()
            .from('decks')
            .select('*')
            .eq('name', 'Deck 2');

        expect(data).toEqual([
            expect.objectContaining({
                name: 'Deck 2',
            }),
        ]);
    });
});
