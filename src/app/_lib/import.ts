import { Session } from '@supabase/supabase-js';
import { RxCollection } from 'rxdb';
import { v4 } from 'uuid';
import * as Yup from 'yup';
import { Deck, Flashcard } from './types';

export const ImportedCardSchema = Yup.object({
    front: Yup.string()
        .required("Front of the card can't be empty")
        .typeError('Front of the card must be a string of text'),
    back: Yup.string()
        .required("Back of the card can't be empty")
        .typeError('Back of the card must be a string of text'),
}).typeError('Card must be an object with a front and back');

export const ImportedDeckSchema = Yup.object({
    name: Yup.string()
        .required('Name of the deck is required')
        .typeError('Name must be a string'),
    description: Yup.string().typeError('Description must be a string'),
    cards: Yup.array(ImportedCardSchema)
        .required('Deck must have at least one card')
        .typeError('Cards must be an array of cards'),
    schemaVersion: Yup.number().typeError('Schema version must be a number'),
});

export type ImportedCard = Yup.InferType<typeof ImportedCardSchema>;

export type ImportedDeck = Yup.InferType<typeof ImportedDeckSchema>;

export const importedCardToFlashcard = ({
    card,
    deck,
    position,
}: {
    card: ImportedCard;
    deck: Deck;
    position: number;
}): Flashcard => {
    return {
        front: card.front,
        back: card.back,
        id: v4(),
        created_at: new Date().toISOString(),
        deck_id: deck.id,
        position,
        _modified: new Date().toISOString(),
        _deleted: false,
    };
};

export const importedDeckToDeck = ({
    deck,
    session,
}: {
    deck: ImportedDeck;
    session: Session;
}): Deck => {
    return {
        id: v4(),
        name: deck.name,
        description: deck.description ?? '',
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        _modified: new Date().toISOString(),
        is_public: false,
        _deleted: false,
    };
};

export const importDeck = async ({
    deck,
    decksCollection,
    flashcardsCollection,
    session,
}: {
    deck: ImportedDeck;
    decksCollection: RxCollection<Deck>;
    flashcardsCollection: RxCollection<Flashcard>;
    session: Session;
}) => {
    const newDeck = importedDeckToDeck({ deck, session });
    const cards = deck.cards.map((card, index) =>
        importedCardToFlashcard({ card, deck: newDeck, position: index }),
    );
    await decksCollection.insert(newDeck);
    await flashcardsCollection.bulkInsert(cards);
    return newDeck;
};
