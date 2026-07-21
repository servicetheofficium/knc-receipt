-- Run this once in the Supabase SQL Editor for this project (eihnhfiubtgylwaqwhvu).
-- Sets up a profiles table so login can gate access to admin users only.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  user_type text not null default 'staff',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

-- Auto-create a profile row whenever a new auth user signs up.
-- New users default to 'staff'; promote to admin manually (see below).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- After creating a user (Authentication > Users > Add user), run this to grant admin access:
-- update public.profiles set user_type = 'admin' where email = 'someone@example.com';
