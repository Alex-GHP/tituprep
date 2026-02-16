-- ============================================================
-- TituPrep - Fix streak expiry in leaderboard
-- Streaks are only valid if the user was active today or yesterday.
-- ============================================================

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
    case
      when p.last_active_date >= (current_date - 1) then p.streak_count
      else 0
    end as streak_count,
    coalesce(sum(ua.score), 0) * (1.0 +
      case
        when p.last_active_date >= (current_date - 1) then p.streak_count
        else 0
      end * 0.1
    ) as leaderboard_score,
    p.created_at
  from public.profiles p
  left join public.user_attempts ua on ua.user_id = p.id
  group by p.id, p.display_name, p.avatar_url, p.streak_count, p.last_active_date, p.created_at
  order by leaderboard_score desc, p.created_at asc;
$$;
