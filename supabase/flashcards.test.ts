import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { TestFixture, dateRegex, uuidRegex } from './test-utils';

describe('flashcards', () => {
    beforeAll(() => {
        TestFixture.initialize();
    });

    beforeEach(async () => TestFixture.logOut());

    it('should allow anon users to view cards in public decks', async () => {
        const { data: deck } = await TestFixture.getClient()
            .from('decks')
            .select('*')
            .eq('name', 'Deck 1')
            .single();
        const { data: card, error } = await TestFixture.getClient()
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
        await TestFixture.logIn('user1@example.com', 'password123');
        const { data: deckData } = await TestFixture.getClient()
            .from('decks')
            .select('id,user_id')
            .eq('name', 'Deck 1');

        const { data: cardData, error: cardError } =
            await TestFixture.getClient()
                .from('flashcards')
                .insert([
                    {
                        deck_id: (deckData![0] as { id: string }).id,
                        front: 'test front',
                        back: 'test back',
                    },
                ])
                .select();

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

        await TestFixture.getClient()
            .from('flashcards')
            .delete()
            .eq('id', cardData![0].id);
        await TestFixture.getClient()
            .from('decks')
            .delete()
            .eq('id', deckData![0].id);
    });

    it('should not allow logged in users to insert new cards into other users decks', async () => {
        await TestFixture.logIn('user2@example.com', 'password123');
        const { data: deckData } = await TestFixture.getClient()
            .from('decks')
            .select('id,user_id')
            .eq('name', 'Deck 1');

        const { error: cardError } = await TestFixture.getClient()
            .from('flashcards')
            .insert([
                {
                    deck_id: (deckData![0] as { id: string }).id,
                    front: 'test front',
                    back: 'test back',
                },
            ])
            .select();

        expect(cardError).not.toBeNull();
        expect(cardError?.message).toEqual(
            'new row violates row-level security policy for table "flashcards"',
        );
    });

    it('should not allow anon users to view cards in private decks', async () => {
        const userId = await TestFixture.logIn(
            'user1@example.com',
            'password123',
        );
        const { data: deckData } = await TestFixture.getClient()
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

        const { data: cardData } = await TestFixture.getClient()
            .from('flashcards')
            .insert([
                {
                    deck_id: (deckData![0] as { id: string }).id,
                    front: 'test front',
                    back: 'test back',
                },
            ])
            .select();

        await TestFixture.getClient().auth.signOut();
        const { data, error } = await TestFixture.getClient()
            .from('flashcards')
            .select('*')
            .eq('id', (cardData![0] as { id: string }).id);

        expect(error).toBeNull();
        expect(data).toEqual([]);

        await TestFixture.getClient()
            .from('flashcards')
            .delete()
            .eq('id', cardData![0].id);
        await TestFixture.getClient()
            .from('decks')
            .delete()
            .eq('id', deckData![0].id);
    });

    it('should not allow authenticated users to view cards in private decks of other users', async () => {
        await TestFixture.logIn('user2@example.com', 'password123');
        const { data: card, error } = await TestFixture.getClient()
            .from('flashcards')
            .select('*')
            .eq('front', 'Front 11');

        expect(error).toBeNull();
        expect(card).toEqual([]);
    });

    it('should allow authenticated users to view cards in their own private decks', async () => {
        await TestFixture.logIn('user1@example.com', 'password123');
        const { data: card, error } = await TestFixture.getClient()
            .from('flashcards')
            .select('*')
            .eq('front', 'Front 11');

        expect(error).toBeNull();
        expect(card).toEqual([
            {
                id: expect.stringMatching(uuidRegex),
                deck_id: expect.stringMatching(uuidRegex),
                front: 'Front 11',
                back: 'Back 11',
                created_at: expect.stringMatching(dateRegex),
                updated_at: expect.stringMatching(dateRegex),
            },
        ]);
    });

    it('should allow anon users to view cards in public decks - in deck_cards_view', async () => {
        const { data: cards, error } = await TestFixture.getClient()
            .from('deck_cards_view')
            .select('*')
            .eq('deck_name', 'Deck 1');

        expect(error).toBeNull();
        expect(cards).toEqual([
            {
                deck_id: expect.stringMatching(uuidRegex),
                deck_name: 'Deck 1',
                deck_description: 'Description for deck 1',
                deck_created_at: expect.stringMatching(dateRegex),
                deck_updated_at: expect.stringMatching(dateRegex),
                card_id: expect.stringMatching(uuidRegex),
                card_front: 'Front 1',
                card_back: 'Back 1',
                card_created_at: expect.stringMatching(dateRegex),
                card_updated_at: expect.stringMatching(dateRegex),
            },
        ]);
    });

    it('should not allow anon users to view cards in private decks - in deck_cards_view', async () => {
        const { data: cards, error } = await TestFixture.getClient()
            .from('deck_cards_view')
            .select('*')
            .eq('deck_name', 'Private deck');

        expect(error).toBeNull();
        expect(cards).toEqual([]);
    });

    it('should not allow authenticated users to view cards in private decks of other users - in deck_cards_view', async () => {
        await TestFixture.logIn('user2@example.com', 'password123');
        const { data: cards, error } = await TestFixture.getClient()
            .from('deck_cards_view')
            .select('*')
            .eq('deck_name', 'Private deck');

        expect(error).toBeNull();
        expect(cards).toEqual([]);
    });

    it('should allow authenticated users to view cards in their own private decks - in deck_cards_view', async () => {
        await TestFixture.logIn('user1@example.com', 'password123');
        const { data: cards, error } = await TestFixture.getClient()
            .from('deck_cards_view')
            .select('*')
            .eq('deck_name', 'Private deck');

        expect(error).toBeNull();
        expect(cards).toEqual([
            {
                deck_id: expect.stringMatching(uuidRegex),
                deck_name: 'Private deck',
                deck_description: 'Description for private deck',
                deck_created_at: expect.stringMatching(dateRegex),
                deck_updated_at: expect.stringMatching(dateRegex),
                card_id: expect.stringMatching(uuidRegex),
                card_front: 'Front 11',
                card_back: 'Back 11',
                card_created_at: expect.stringMatching(dateRegex),
                card_updated_at: expect.stringMatching(dateRegex),
            },
        ]);
    });
});
