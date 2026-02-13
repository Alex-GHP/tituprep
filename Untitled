-- ============================================================
-- TituPrep - Leaderboard & Daily Streak
-- ============================================================

-- Add streak tracking columns to profiles
alter table public.profiles
  add column if not exists streak_count int not null default 0,
  add column if not exists last_active_date date;

-- Allow all authenticated users to read all profiles (needed for leaderboard)
drop policy if exists "Users can view own profile" on public.profiles;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- Keep the update policy restricted to own profile
-- (already exists: "Users can update own profile")

-- Leaderboard RPC: returns aggregated scores with streak multiplier
-- Runs as security definer to bypass RLS on user_attempts
create or replace function public.get_leaderboard()
returns table (
  user_id uuid,
  display_name text,
  avatar_url text,
  total_score numeric,
  streak_count int,
  leaderboard_score numeric,
  created_at timestamptz
)
language sql
security definer
set search_path = ''
as $$
  select
    p.id as user_id,
    p.display_name,
    p.avatar_url,
    coalesce(sum(ua.score), 0) as total_score,
    p.streak_count,
    coalesce(sum(ua.score), 0) * (1.0 + p.streak_count * 0.1) as leaderboard_score,
    p.created_at
  from public.profiles p
  left join public.user_attempts ua on ua.user_id = p.id
  group by p.id, p.display_name, p.avatar_url, p.streak_count, p.created_at
  order by leaderboard_score desc, p.created_at asc;
$$;
