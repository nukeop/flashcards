-- Create table public.decks
create table public.decks (
    id uuid DEFAULT uuid_generate_v4() not null primary key,
    user_id uuid not null references auth.users (id),
    name text not null,
    description text not null,
    is_public boolean not null default false,
    created_at timestamp with time zone not null default timezone ('utc'::text, now ()),
    _deleted boolean DEFAULT false NOT NULL,
    _modified timestamp with time zone default timezone ('utc'::text, now ()) NOT NULL
);
-- Enable RLS on public.decks
alter table public.decks enable row level security;
-- Create table public.flashcards
create table public.flashcards (
    id uuid DEFAULT uuid_generate_v4() not null primary key,
    deck_id uuid not null references public.decks (id),
    front text not null,
    back text not null,
    position integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone not null default timezone ('utc'::text, now ()),
    _deleted boolean DEFAULT false NOT NULL,
    _modified timestamp with time zone default timezone ('utc'::text, now ()) NOT NULL
);
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
-- Create table public.user_profiles
create table public.user_profiles (
    id uuid not null primary key,
    user_id uuid not null references auth.users (id),
    display_name text not null,
    created_at timestamp with time zone not null default timezone ('utc'::text, now ()),
    _modified timestamp with time zone default timezone ('utc'::text, now ()) NOT NULL,
    _deleted boolean DEFAULT false NOT NULL
);
-- Create a function to create a profile when a user is created
create or replace function create_user_profile() returns trigger as $$ begin
insert into public.user_profiles (id, user_id, display_name)
values (gen_random_uuid(), NEW.id, NEW.email);
return NEW;
end;
$$ language plpgsql security definer;
-- Create a function to delete the linked profile when a user is deleted
create or replace function delete_user_profile() returns trigger as $$ begin
delete from public.user_profiles
where user_id = old.id;
return old;
end;
$$ language plpgsql security definer;
-- Create a trigger to create a profile when a user is created
create trigger handle_create_user_profile
after
insert on auth.users for each row execute procedure create_user_profile();
-- Create a trigger to delete the linked profile when a user is deleted
create trigger handle_delete_user_profile
after delete on auth.users for each row execute procedure delete_user_profile();
-- Enable RLS on public.user_profiles
alter table public.user_profiles enable row level security;
-- Create indexes for user_profiles
Create index on public.user_profiles (user_id);
-- Policy to allow anon users to read public user_profiles
create policy "Allow anon users to read public user_profiles" on public.user_profiles for
select using (true);
-- Policy to allow authenticated users to update their own user_profiles
create policy "Allow users to update their own user_profiles" on public.user_profiles for
update using (auth.uid() = user_id);