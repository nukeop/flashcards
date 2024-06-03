import { beforeEach } from 'node:test';
import { beforeAll, describe, expect, it } from 'vitest';
import { dateRegex, TestFixture, uuidRegex } from './test-utils';

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
            .select('*')
            .eq('is_public', true);
        expect(error).toBeNull();
        expect(data?.length).toBe(10);
        data?.forEach((deck, index) => {
            expect(deck).toEqual({
                created_at: expect.stringMatching(dateRegex),
                description: 'This is a public deck',
                id: expect.stringMatching(uuidRegex),
                name: `public deck ${index + 1}`,
                is_public: true,
                _modified: expect.stringMatching(dateRegex),
                _deleted: false,
                user_id: expect.stringMatching(uuidRegex),
            });
        });
    });

    it('should not return private decks with anon key', async () => {
        await TestFixture.getClient().auth.signOut();

        const { data: anonData, error: anonError } =
            await TestFixture.getClient()
                .from('decks')
                .select('*')
                .neq('is_public', true);
        expect(anonError).toBeNull();
        expect(anonData).toEqual([]);
    });

    it('should return public decks with user key', async () => {
        await TestFixture.logIn('user2@example.com', 'password123');
        const { data, error } = await TestFixture.getClient()
            .from('decks')
            .select('*')
            .eq('is_public', true);

        expect(error).toBeNull();
        expect(data?.length).toBe(10);
        data?.forEach((deck, index) => {
            expect(deck).toEqual({
                created_at: expect.stringMatching(dateRegex),
                description: 'This is a public deck',
                id: expect.stringMatching(uuidRegex),
                name: `public deck ${index + 1}`,
                is_public: true,
                _modified: expect.stringMatching(dateRegex),
                _deleted: false,
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
            .eq('user_id', userId);

        expect(data).toEqual([
            {
                created_at: expect.stringMatching(dateRegex),
                description: 'This is a private deck',
                id: expect.stringMatching(uuidRegex),
                name: 'private deck 2',
                is_public: false,
                _modified: expect.stringMatching(dateRegex),
                _deleted: false,
                user_id: userId,
            },
        ]);
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
                _modified: expect.stringMatching(dateRegex),
                _deleted: false,
                created_at: expect.stringMatching(dateRegex),
            },
        ]);

        // Cleanup
        await TestFixture.getClient()
            .from('decks')
            .delete()
            .eq('name', 'test deck');
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

    it("should not allow a user to delete another user's deck", async () => {
        await TestFixture.logIn('user1@example.com', 'password123');

        await TestFixture.getClient()
            .from('decks')
            .delete()
            .eq('name', 'public deck 3');
        await TestFixture.logIn('user2@example.com', 'password123');
        const { data } = await TestFixture.getClient()
            .from('decks')
            .select('*')
            .eq('name', 'public deck 3');

        expect(data).toEqual([
            expect.objectContaining({
                name: 'public deck 3',
            }),
        ]);
    });
});
