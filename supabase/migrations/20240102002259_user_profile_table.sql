-- Create table public.user_profiles
create table public.user_profiles (
    id uuid not null primary key,
    user_id uuid not null references auth.users (id),
    username text not null,
    created_at timestamp with time zone not null default timezone ('utc'::text, now ()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now ())
);
-- Create a trigger to update the updated_at column on updates
create trigger handle_updated_at before
update on public.user_profiles for each row execute procedure moddatetime (updated_at);
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