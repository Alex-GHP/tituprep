-- ============================================================
-- TituPrep - Initial Database Schema
-- ============================================================

-- 1. Subjects lookup table
create table if not exists public.subjects (
  id text primary key,
  name_en text not null,
  name_ro text not null,
  module text
);

-- 2. Questions bank
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  question_en text not null,
  question_ro text not null,
  correct_answer_en text not null,
  correct_answer_ro text not null,
  wrong_answers_en text[] not null,
  wrong_answers_ro text[] not null,
  explanation_en text,
  explanation_ro text,
  subject_id text not null references public.subjects(id) on delete cascade
);

create index if not exists idx_questions_subject on public.questions(subject_id);

-- 3. Exams table (standard, subject, or random)
create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  exam_number int,
  type text not null check (type in ('standard', 'subject', 'random')),
  subject_id text references public.subjects(id) on delete set null,
  title_en text,
  title_ro text,
  created_at timestamptz default now()
);

create index if not exists idx_exams_type on public.exams(type);
create unique index if not exists idx_exams_standard_number on public.exams(exam_number) where type = 'standard';

-- 4. Exam-Questions junction (many-to-many with ordering)
create table if not exists public.exam_questions (
  exam_id uuid not null references public.exams(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  position int not null,
  primary key (exam_id, question_id)
);

create index if not exists idx_exam_questions_exam on public.exam_questions(exam_id);

-- 5. User profiles (linked to Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  preferred_language text default 'en' check (preferred_language in ('en', 'ro')),
  created_at timestamptz default now()
);

-- 6. User exam attempts
create table if not exists public.user_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exam_id uuid not null references public.exams(id) on delete cascade,
  score numeric(3,1) not null check (score >= 0 and score <= 10),
  total_questions int not null,
  correct_count int not null,
  answers jsonb not null default '[]'::jsonb,
  time_taken_seconds int,
  completed_at timestamptz default now()
);

create index if not exists idx_attempts_user_exam on public.user_attempts(user_id, exam_id);
create index if not exists idx_attempts_user on public.user_attempts(user_id);

-- ============================================================
-- Row-Level Security (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table public.subjects enable row level security;
alter table public.questions enable row level security;
alter table public.exams enable row level security;
alter table public.exam_questions enable row level security;
alter table public.profiles enable row level security;
alter table public.user_attempts enable row level security;

-- Subjects: read-only for authenticated users
create policy "Subjects are viewable by authenticated users"
  on public.subjects for select
  to authenticated
  using (true);

-- Questions: read-only for authenticated users
create policy "Questions are viewable by authenticated users"
  on public.questions for select
  to authenticated
  using (true);

-- Exams: read-only for authenticated users
create policy "Exams are viewable by authenticated users"
  on public.exams for select
  to authenticated
  using (true);

-- Exams: authenticated users can insert random exams
create policy "Users can create random exams"
  on public.exams for insert
  to authenticated
  with check (type = 'random');

-- Exam Questions: read-only for authenticated users
create policy "Exam questions are viewable by authenticated users"
  on public.exam_questions for select
  to authenticated
  using (true);

-- Exam Questions: users can link questions to their random exams
create policy "Users can insert exam questions for random exams"
  on public.exam_questions for insert
  to authenticated
  with check (
    exists (
      select 1 from public.exams
      where exams.id = exam_id and exams.type = 'random'
    )
  );

-- Profiles: users can view and update only their own profile
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- User Attempts: users can view and insert their own attempts only
create policy "Users can view own attempts"
  on public.user_attempts for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on public.user_attempts for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ============================================================
-- Auto-create profile on user sign-up
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture', '')
  );
  return new;
end;
$$;

-- Trigger on auth.users insert
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
