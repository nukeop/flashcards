CREATE OR REPLACE FUNCTION moddatetime() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = timezone('utc', now());
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create table public.decks
create table public.decks (
    id uuid DEFAULT uuid_generate_v4() not null primary key,
    user_id uuid not null references auth.users (id),
    name text not null,
    description text not null,
    is_public boolean not null default false,
    created_at timestamp with time zone not null default timezone ('utc'::text, now ()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now ()),
    constraint decks_user_id_name_key unique (user_id, name)
);
-- Enable RLS on public.decks
alter table public.decks enable row level security;
-- Create table public.flashcards
create table public.flashcards (
    id uuid DEFAULT uuid_generate_v4() not null primary key,
    deck_id uuid not null references public.decks (id),
    front text not null,
    back text not null,
    created_at timestamp with time zone not null default timezone ('utc'::text, now ()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now ()),
    constraint flashcards_deck_id_front_key unique (deck_id, front)
);
-- Create triggers to update the updated_at column on updates
create trigger handle_flashcards_updated_at before
update on public.flashcards for each row execute procedure moddatetime();
create trigger handle_decks_updated_at before
update on public.decks for each row execute procedure moddatetime();
-- Enable RLS on public.flashcards
alter table public.flashcards enable row level security;
-- Allow anon users to read public.flashcards
grant select on public.flashcards to anon;
-- Create indexes for flashcards and decks
Create index on public.flashcards (deck_id);
Create index on public.decks (user_id);
-- Policy to allow authenticated users to read their own decks, regardless of public status, and other users' public decks
create policy "Allow users to read their own decks" on public.decks for
select to authenticated using (
        auth.uid() = user_id
        OR is_public = true
    );
-- Policy to allow anon users to read public decks
create policy "Allow anon users to read public decks" on public.decks for
select to anon using (is_public = true);
-- Policy to allow authenticated users to insert new decks
create policy "Allow users to insert decks" on public.decks for
insert to authenticated with check(auth.uid() = user_id);
-- Policy to allow authenticated users to update their own decks
create policy "Allow users to update their own decks" on public.decks for
update to authenticated using (auth.uid() = user_id);
-- Policy to allow authenticated users to delete their own decks
create policy "Allow users to delete their own decks" on public.decks for delete to authenticated using (auth.uid() = user_id);
-- Policy to allow authenticated users to insert new flashcards
create policy "Allow users to insert flashcards" on public.flashcards for
insert to authenticated with check (
        auth.uid() = (
            select user_id
            from public.decks
            where id = deck_id
        )
    );
-- Policy to allow authenticated users to update their own flashcards
create policy "Allow users to update their own flashcards" on public.flashcards for
update using (
        auth.uid() = (
            select user_id
            from public.decks
            where id = deck_id
        )
    );
-- Policy to allow authenticated users to delete their own flashcards
create policy "Allow users to delete their own flashcards" on public.flashcards for delete to authenticated using (
    auth.uid() = (
        select user_id
        from public.decks
        where id = deck_id
    )
);
-- Policy to allow anon users to read flashcard in public decks
create policy "Allow anon users to read flashcards in public decks" on public.flashcards for
select to anon using (
        EXISTS (
            SELECT 1
            FROM public.decks
            WHERE id = deck_id
                AND is_public = true
        )
    );
-- Policy to allow users to read flashcards in their own decks
create policy "Allow users to read flashcards in their own decks" on public.flashcards for
select to authenticated using (
        auth.uid() = (
            select user_id
            from public.decks
            where id = deck_id
        )
    );