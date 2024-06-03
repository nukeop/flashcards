import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { nCards } from './migrations/test-data';
import { dateRegex, TestFixture, uuidRegex } from './test-utils';

describe('flashcards', () => {
    beforeAll(() => {
        TestFixture.initialize();
    });

    beforeEach(async () => TestFixture.logOut());

    it('should allow anon users to view cards in public decks', async () => {
        const { data: deck } = await TestFixture.getClient()
            .from('decks')
            .select('*')
            .eq('name', 'public deck 1')
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
            front: 'Front',
            back: 'Back',
            position: 1,
            created_at: expect.stringMatching(dateRegex),
            _modified: expect.stringMatching(dateRegex),
            _deleted: false,
        });
    });

    it('should allow logged in users to insert new cards into their own decks', async () => {
        await TestFixture.logIn('user1@example.com', 'password123');
        const { data: deckData } = await TestFixture.getClient()
            .from('decks')
            .select('id,user_id')
            .eq('name', 'public deck 2');

        const { data: cardData, error: cardError } =
            await TestFixture.getClient()
                .from('flashcards')
                .insert([
                    {
                        deck_id: (deckData![0] as { id: string }).id,
                        front: 'test front',
                        back: 'test back',
                        position: 2,
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
                position: 2,
                created_at: expect.stringMatching(dateRegex),
                _modified: expect.stringMatching(dateRegex),
                _deleted: false,
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
            .eq('name', 'public deck 1');

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
                    position: 1,
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
        await TestFixture.logIn('user3@example.com', 'password123');
        const { data: user3Card } = await TestFixture.getClient()
            .from('flashcards')
            .select('*')
            .eq('front', 'Front');

        await TestFixture.logIn('user2@example.com', 'password123');
        const { data: card, error } = await TestFixture.getClient()
            .from('flashcards')
            .select('*')
            .eq('id', user3Card![0].id);

        expect(error).toBeNull();
        expect(card).toEqual([]);
    });

    it('should allow authenticated users to view cards in their own private decks', async () => {
        await TestFixture.logIn('user1@example.com', 'password123');
        const { data: deckData } = await TestFixture.getClient()
            .from('decks')
            .select('id')
            .eq('name', 'private deck 2')
            .single();
        const { data: cards, error } = await TestFixture.getClient()
            .from('flashcards')
            .select('*')
            .eq('deck_id', deckData!.id);

        expect(error).toBeNull();
        expect(cards).toEqual([
            {
                id: expect.stringMatching(uuidRegex),
                deck_id: deckData!.id,
                front: `Front`,
                back: `Back`,
                position: 1,
                created_at: expect.stringMatching(dateRegex),
                _modified: expect.stringMatching(dateRegex),
                _deleted: false,
            },
        ]);
    });

    it('should allow authenticated users to update their own cards by id', async () => {
        await TestFixture.logIn('user1@example.com', 'password123');
        const { data: deckData } = await TestFixture.getClient()
            .from('decks')
            .select('id')
            .eq('name', 'public deck 2')
            .single();
        const { data: cardData } = await TestFixture.getClient()
            .from('flashcards')
            .select('*')
            .eq('front', 'Front')
            .eq('deck_id', deckData!.id)
            .single();
        await TestFixture.getClient()
            .from('flashcards')
            .update({
                front: 'New front text',
                back: 'New back text',
            })
            .eq('id', cardData!.id);

        const { data: card, error } = await TestFixture.getClient()
            .from('flashcards')
            .select('*')
            .eq('front', 'New front text');

        expect(error).toBeNull();
        expect(card).toEqual([
            {
                id: expect.stringMatching(uuidRegex),
                deck_id: expect.stringMatching(uuidRegex),
                front: 'New front text',
                back: 'New back text',
                position: 1,
                created_at: expect.stringMatching(dateRegex),
                _modified: expect.stringMatching(dateRegex),
                _deleted: false,
            },
        ]);
    });

    it('cards within a deck should have unique position values', async () => {
        await TestFixture.logIn('user1@example.com', 'password123');
        const { data: deckData } = await TestFixture.getClient()
            .from('decks')
            .select('id,user_id')
            .eq('name', 'public deck 2');

        const { data: cardData } = await TestFixture.getClient()
            .from('flashcards')
            .select('position')
            .eq('deck_id', (deckData![0] as { id: string }).id);

        const positions = cardData!.map((card) => card.position);
        const uniquePositions = new Set(positions);
        expect(positions.length).toEqual(uniquePositions.size);
    });
});
