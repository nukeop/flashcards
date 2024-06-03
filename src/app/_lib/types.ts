import { Database } from './database.types';

export type Deck = Database['public']['Tables']['decks']['Row'];
export type Flashcard = Database['public']['Tables']['flashcards']['Row'];
