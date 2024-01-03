create extension if not exists moddatetime schema extensions;
-- Create table public.decks
create table public.decks (
    id uuid not null primary key,
    user_id uuid not null references auth.users (id),
    name text not null,
    description text not null,
    public boolean not null default false,
    created_at timestamp with time zone not null default timezone ('utc'::text, now ()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now ()),
    constraint decks_user_id_name_key unique (user_id, name)
);
-- Create a trigger to update the updated_at column on updates
create trigger handle_updated_at before
update on public.decks for each row execute procedure moddatetime (updated_at);
-- Enable RLS on public.decks
alter table public.decks enable row level security;
-- Create table public.flashcards
create table public.flashcards (
    id uuid not null primary key,
    deck_id uuid not null references public.decks (id),
    front text not null,
    back text not null,
    created_at timestamp with time zone not null default timezone ('utc'::text, now ()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now ()),
    constraint flashcards_deck_id_front_key unique (deck_id, front)
);
-- Create triggers to update the updated_at column on updates
create trigger handle_flashcards_updated_at before
update on public.flashcards for each row execute procedure moddatetime (updated_at);
create trigger handle_decks_updated_at before
update on public.decks for each row execute procedure moddatetime (updated_at);
-- Enable RLS on public.flashcards
alter table public.flashcards enable row level security;
-- Allow anon users to read public.flashcards
grant select on public.flashcards to anon;
-- Create indexes for flashcards and decks
Create index on public.flashcards (deck_id);
Create index on public.decks (user_id);
-- Policy to allow authenticated users to read their own decks, regardless of public status
create policy "Allow users to read their own decks" on public.decks for
select using (auth.uid() = user_id);
-- Policy to allow anon users to read public decks
create policy "Allow anon users to read public decks" on public.decks for
select using (public = true);