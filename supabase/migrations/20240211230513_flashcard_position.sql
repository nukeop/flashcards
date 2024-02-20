-- New flashcard position column
alter table public.flashcards
add column position integer NOT NULL DEFAULT 0;
ALTER TABLE public.flashcards
ADD CONSTRAINT flashcards_deck_id_position_unique UNIQUE (deck_id, position);
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
CREATE OR REPLACE FUNCTION reorder_card(card_id_arg UUID, new_position_arg INTEGER) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE original_position INTEGER;
deck_id_arg UUID;
BEGIN
SELECT deck_id,
    position INTO deck_id_arg,
    original_position
FROM public.flashcards
WHERE id = card_id_arg;
IF original_position < new_position_arg THEN -- Moving towards a higher position: shift cards between the original and new positions back by 1.
UPDATE public.flashcards
SET position = position - 1
WHERE deck_id = deck_id_arg
    AND position > original_position
    AND position <= new_position_arg;
ELSE -- Moving towards a lower position or inserting: shift cards between the original and new positions forward by 1.
UPDATE public.flashcards
SET position = position + 1
WHERE deck_id = deck_id_arg
    AND position < original_position
    AND position >= new_position_arg;
END IF;
-- Update the position of the moving card.
UPDATE public.flashcards
SET position = new_position_arg
WHERE id = card_id_arg;
END;
$$;
CREATE OR REPLACE FUNCTION swap_cards(card_id_1_arg UUID, card_id_2_arg UUID) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE position_1 INTEGER;
position_2 INTEGER;
BEGIN
SELECT position INTO position_1
FROM public.flashcards
WHERE id = card_id_1_arg;
SELECT position INTO position_2
FROM public.flashcards
WHERE id = card_id_2_arg;
UPDATE public.flashcards
SET position = -1
WHERE id = card_id_1_arg;
UPDATE public.flashcards
SET position = position_1
WHERE id = card_id_2_arg;
UPDATE public.flashcards
SET position = position_2
WHERE id = card_id_1_arg;
END;
$$;
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