-- Create table public.user_profiles
create table public.user_profiles (
    id uuid not null primary key,
    user_id uuid not null references auth.users (id),
    display_name text not null,
    created_at timestamp with time zone not null default timezone ('utc'::text, now ()),
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
-- Create a trigger to update the updated_at column on updates
create trigger handle_updated_at before
update on public.user_profiles for each row execute procedure moddatetime();
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