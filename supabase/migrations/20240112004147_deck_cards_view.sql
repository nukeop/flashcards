CREATE VIEW deck_cards_view AS
SELECT decks.id AS deck_id,
    decks.name AS deck_name,
    decks.description AS deck_description,
    decks.created_at AS deck_created_at,
    decks.updated_at AS deck_updated_at,
    flashcards.id AS card_id,
    flashcards.front AS card_front,
    flashcards.back AS card_back,
    flashcards.created_at AS card_created_at,
    flashcards.updated_at AS card_updated_at
FROM decks
    INNER JOIN public.flashcards ON public.decks.id = public.flashcards.deck_id
ORDER BY public.decks.id,
    public.flashcards.id;
ALTER VIEW deck_cards_view
SET (security_invoker = true);