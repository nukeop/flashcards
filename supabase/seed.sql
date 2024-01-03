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
    ) (
        select '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4 (),
            'authenticated',
            'authenticated',
            'user' || (ROW_NUMBER() OVER ()) || '@example.com',
            crypt ('password123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM generate_series(1, 10)
    );
INSERT INTO auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select uuid_generate_v4 (),
            id,
            id,
            format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from auth.users
    );
INSERT INTO public.decks (
        id,
        user_id,
        name,
        description,
        public,
        created_at,
        updated_at
    ) (
        select uuid_generate_v4 (),
            id,
            'Deck ' || (ROW_NUMBER() OVER ())::text,
            'Description for deck ' || (ROW_NUMBER() OVER ())::text,
            true,
            current_timestamp,
            current_timestamp
        from auth.users
    );
INSERT INTO public.decks (
        id,
        user_id,
        name,
        description,
        public,
        created_at,
        updated_at
    ) (
        select uuid_generate_v4 (),
            id,
            'Private deck',
            'Description for private deck',
            false,
            current_timestamp,
            current_timestamp
        from auth.users
        where email = 'user1@example.com'
    );