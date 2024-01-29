import { Database } from './database.types';

export type Deck = Database['public']['Tables']['decks']['Row'];
export type Flashcard = Database['public']['Tables']['flashcards']['Row'];
export type DeckCardView =
    Database['public']['Views']['deck_cards_view']['Row'];
