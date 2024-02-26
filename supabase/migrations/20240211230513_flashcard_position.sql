-- New flashcard position column
alter table public.flashcards
add column position integer NOT NULL DEFAULT 0;
-- Utility functions for handling flashcard positions
CREATE OR REPLACE FUNCTION get_next_card_position(deck_id_arg UUID) RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE next_position INTEGER;
BEGIN
SELECT COALESCE(MAX(position), 0) + 1 INTO next_position
FROM public.flashcards
WHERE deck_id = deck_id_arg;
RETURN next_position;
END;
$$;
CREATE OR REPLACE FUNCTION update_card_positions(card_ids UUID [], new_positions INT []) RETURNS VOID AS $$ BEGIN -- Perform the update
    WITH updates AS (
        SELECT unnest(card_ids) AS card_id,
            unnest(new_positions) AS new_position
    )
UPDATE flashcards fc
SET position = updates.new_position
FROM updates
WHERE fc.id = updates.card_id;
END;
$$ LANGUAGE plpgsql;
-- Migration for existing flashcards
WITH ordered_flashcards AS (
    SELECT id,
        ROW_NUMBER() OVER(
            PARTITION BY deck_id
            ORDER BY created_at ASC
        ) AS new_position
    FROM public.flashcards
)
UPDATE public.flashcards
SET position = ordered_flashcards.new_position
FROM ordered_flashcards
WHERE public.flashcards.id = ordered_flashcards.id;
-- Add the position column to the deck_cards_view
DROP VIEW IF EXISTS deck_cards_view;
CREATE OR REPLACE VIEW deck_cards_view AS
SELECT decks.id AS deck_id,
    decks.name AS deck_name,
    decks.description AS deck_description,
    decks.created_at AS deck_created_at,
    decks.updated_at AS deck_updated_at,
    flashcards.id AS card_id,
    flashcards.front AS card_front,
    flashcards.back AS card_back,
    flashcards.position AS card_position,
    flashcards.created_at AS card_created_at,
    flashcards.updated_at AS card_updated_at
FROM decks
    INNER JOIN public.flashcards ON public.decks.id = public.flashcards.deck_id
ORDER BY public.decks.id,
    public.flashcards.position;
ALTER VIEW deck_cards_view
SET (security_invoker = true);