WITH ordered_users AS (
    SELECT generate_series(0, 9) AS user_number,
        'user' || generate_series(0, 9) || '@example.com' AS email,
        uuid_generate_v4() AS user_id
)
INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
SELECT '00000000-0000-0000-0000-000000000000' AS instance_id,
    ou.user_id AS id,
    'authenticated' AS aud,
    'authenticated' AS role,
    ou.email AS email,
    crypt('password123', gen_salt('bf')) AS encrypted_password,
    current_timestamp AS email_confirmed_at,
    current_timestamp AS recovery_sent_at,
    current_timestamp AS last_sign_in_at,
    '{"provider":"email","providers":["email"]}' AS raw_app_meta_data,
    '{}' AS raw_user_meta_data,
    current_timestamp AS created_at,
    current_timestamp AS updated_at,
    '' AS confirmation_token,
    '' AS email_change,
    '' AS email_change_token_new,
    '' AS recovery_token
FROM ordered_users ou;
-- Insert identities for the test users
WITH ordered_users AS (
    SELECT u.id,
        u.email
    FROM auth.users u
    ORDER BY u.email
)
INSERT INTO auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    )
SELECT uuid_generate_v4() AS id,
    ou.id AS user_id,
    ou.id AS provider_id,
    format(
        '{"sub":"%s","email":"%s"}',
        ou.id::text,
        ou.email
    )::jsonb AS identity_data,
    'email' AS provider,
    current_timestamp AS last_sign_in_at,
    current_timestamp AS created_at,
    current_timestamp AS updated_at
FROM ordered_users ou;
-- Insert public and private decks for each user
WITH ordered_users AS (
    SELECT u.id AS user_id,
        row_number() OVER (
            ORDER BY u.email
        ) AS user_number
    FROM auth.users u
    ORDER BY u.email
)
INSERT INTO public.decks (
        id,
        user_id,
        name,
        description,
        is_public,
        created_at,
        _deleted,
        _modified
    )
SELECT uuid_generate_v4(),
    ou.user_id,
    'public deck ' || ou.user_number,
    'This is a public deck',
    true,
    current_timestamp,
    false,
    current_timestamp
FROM ordered_users ou
UNION ALL
SELECT uuid_generate_v4(),
    ou.user_id,
    'private deck ' || ou.user_number,
    'This is a private deck',
    false,
    current_timestamp,
    false,
    current_timestamp
FROM ordered_users ou;
-- Insert at least one flashcard into each deck
WITH decks_ordered AS (
    SELECT d.id AS deck_id,
        d.name AS deck_name
    FROM public.decks d
    ORDER BY d.name
)
INSERT INTO public.flashcards (
        id,
        deck_id,
        front,
        back,
        position,
        created_at,
        _deleted,
        _modified
    )
SELECT uuid_generate_v4(),
    do_decks.deck_id,
    'Front',
    'Back',
    1,
    current_timestamp,
    false,
    current_timestamp
FROM decks_ordered do_decks;