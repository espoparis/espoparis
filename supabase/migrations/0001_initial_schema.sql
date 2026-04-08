create extension if not exists "pgcrypto";

do $$
begin
  create type public.app_role as enum ('admin', 'teacher', 'student');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.approval_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.course_type as enum ('diploma', 'bachelors');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.course_level as enum ('beginner', 'intermediate', 'advanced');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.course_status as enum ('draft', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.media_kind as enum ('video', 'document');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.enrollment_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.approval_status = 'approved'
  );
$$;

create or replace function public.is_course_teacher(course_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.courses c
    where c.id = course_uuid
      and c.teacher_id = auth.uid()
  );
$$;

create or replace function public.has_approved_enrollment(course_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.enrollments e
    where e.course_id = course_uuid
      and e.student_id = auth.uid()
      and e.status = 'approved'
  );
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null default 'student',
  approval_status public.approval_status not null default 'pending',
  full_name text not null,
  avatar_path text,
  bio text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table if not exists public.student_applications (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  has_taken_courses boolean not null default false,
  primary_interest text not null,
  previous_courses text not null default '',
  submitted_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text not null,
  type public.course_type not null,
  level public.course_level not null,
  duration_label text not null,
  thumbnail_path text,
  status public.course_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists courses_teacher_id_idx on public.courses (teacher_id);
create index if not exists courses_status_idx on public.courses (status);
create index if not exists courses_created_at_idx on public.courses (created_at desc);

create trigger courses_set_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

create table if not exists public.course_media (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  kind public.media_kind not null,
  title text not null,
  storage_path text not null unique,
  thumbnail_path text,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists course_media_course_id_idx on public.course_media (course_id);
create index if not exists course_media_sort_order_idx on public.course_media (course_id, sort_order);

create trigger course_media_set_updated_at
before update on public.course_media
for each row execute function public.set_updated_at();

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  status public.enrollment_status not null default 'pending',
  applied_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id) on delete set null,
  unique (course_id, student_id)
);

create index if not exists enrollments_course_id_idx on public.enrollments (course_id);
create index if not exists enrollments_student_id_idx on public.enrollments (student_id);
create index if not exists enrollments_status_idx on public.enrollments (status);

create table if not exists public.course_reviews (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (course_id, student_id)
);

create index if not exists course_reviews_course_id_idx on public.course_reviews (course_id);
create index if not exists course_reviews_student_id_idx on public.course_reviews (student_id);

alter table public.profiles enable row level security;
alter table public.student_applications enable row level security;
alter table public.courses enable row level security;
alter table public.course_media enable row level security;
alter table public.enrollments enable row level security;
alter table public.course_reviews enable row level security;

create policy "Profiles are readable by owners, approved teachers, and admins"
on public.profiles
for select
using (
  auth.uid() = id
  or is_admin()
  or (role = 'teacher' and approval_status = 'approved')
);

create policy "Profiles are insertable by their owner"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Profiles are updatable by their owner or admins"
on public.profiles
for update
using (auth.uid() = id or is_admin())
with check (auth.uid() = id or is_admin());

create policy "Student applications are readable by owners and admins"
on public.student_applications
for select
using (auth.uid() = profile_id or is_admin());

create policy "Student applications are insertable by owners"
on public.student_applications
for insert
with check (auth.uid() = profile_id);

create policy "Student applications are updatable by admins"
on public.student_applications
for update
using (is_admin())
with check (is_admin());

create policy "Published courses are publicly readable"
on public.courses
for select
using (
  status = 'published'
  or teacher_id = auth.uid()
  or is_admin()
);

create policy "Teachers and admins can create courses"
on public.courses
for insert
with check (
  teacher_id = auth.uid()
  and (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('teacher', 'admin')
        and p.approval_status = 'approved'
    )
  )
);

create policy "Teachers and admins can update courses"
on public.courses
for update
using (teacher_id = auth.uid() or is_admin())
with check (teacher_id = auth.uid() or is_admin());

create policy "Teachers and admins can delete courses"
on public.courses
for delete
using (teacher_id = auth.uid() or is_admin());

create policy "Course media is readable by course owners, approved students, and admins"
on public.course_media
for select
using (
  is_admin()
  or exists (
    select 1
    from public.courses c
    where c.id = course_id
      and (
        c.teacher_id = auth.uid()
        or (c.status = 'published' and public.has_approved_enrollment(c.id))
      )
  )
);

create policy "Course media can be inserted by course owners and admins"
on public.course_media
for insert
with check (
  is_admin()
  or exists (
    select 1
    from public.courses c
    where c.id = course_id
      and c.teacher_id = auth.uid()
  )
);

create policy "Course media can be updated by course owners and admins"
on public.course_media
for update
using (
  is_admin()
  or exists (
    select 1
    from public.courses c
    where c.id = course_id
      and c.teacher_id = auth.uid()
  )
)
with check (
  is_admin()
  or exists (
    select 1
    from public.courses c
    where c.id = course_id
      and c.teacher_id = auth.uid()
  )
);

create policy "Course media can be deleted by course owners and admins"
on public.course_media
for delete
using (
  is_admin()
  or exists (
    select 1
    from public.courses c
    where c.id = course_id
      and c.teacher_id = auth.uid()
  )
);

create policy "Enrollments are readable by the student, course owner, and admins"
on public.enrollments
for select
using (
  student_id = auth.uid()
  or is_admin()
  or exists (
    select 1
    from public.courses c
    where c.id = course_id
      and c.teacher_id = auth.uid()
  )
);

create policy "Students can apply to their own enrollments"
on public.enrollments
for insert
with check (
  student_id = auth.uid()
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'student'
      and p.approval_status = 'approved'
  )
);

create policy "Course owners and admins can review enrollments"
on public.enrollments
for update
using (
  is_admin()
  or exists (
    select 1
    from public.courses c
    where c.id = course_id
      and c.teacher_id = auth.uid()
  )
)
with check (
  is_admin()
  or exists (
    select 1
    from public.courses c
    where c.id = course_id
      and c.teacher_id = auth.uid()
  )
);

create policy "Enrollments can be deleted by the student, course owner, and admins"
on public.enrollments
for delete
using (
  student_id = auth.uid()
  or is_admin()
  or exists (
    select 1
    from public.courses c
    where c.id = course_id
      and c.teacher_id = auth.uid()
  )
);

create policy "Published course reviews are publicly readable"
on public.course_reviews
for select
using (
  is_admin()
  or student_id = auth.uid()
  or exists (
    select 1
    from public.courses c
    where c.id = course_id
      and c.status = 'published'
  )
);

create policy "Approved students can write one review per course"
on public.course_reviews
for insert
with check (
  student_id = auth.uid()
  and exists (
    select 1
    from public.enrollments e
    where e.course_id = course_id
      and e.student_id = auth.uid()
      and e.status = 'approved'
  )
);

create policy "Students can update their own reviews or admins can moderate"
on public.course_reviews
for update
using (student_id = auth.uid() or is_admin())
with check (student_id = auth.uid() or is_admin());

create policy "Students can delete their own reviews or admins can moderate"
on public.course_reviews
for delete
using (student_id = auth.uid() or is_admin());

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role_text text := lower(coalesce(new.raw_user_meta_data ->> 'role', 'student'));
  resolved_role public.app_role;
  resolved_approval public.approval_status;
begin
  if user_role_text not in ('admin', 'teacher', 'student') then
    user_role_text := 'student';
  end if;

  resolved_role := user_role_text::public.app_role;
  resolved_approval := case
    when resolved_role = 'admin' then 'approved'::public.approval_status
    else 'pending'::public.approval_status
  end;

  insert into public.profiles (
    id,
    role,
    approval_status,
    full_name,
    avatar_path,
    bio
  )
  values (
    new.id,
    resolved_role,
    resolved_approval,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1)),
    nullif(new.raw_user_meta_data ->> 'avatar_path', ''),
    coalesce(new.raw_user_meta_data ->> 'bio', '')
  )
  on conflict (id) do update
  set
    role = excluded.role,
    approval_status = excluded.approval_status,
    full_name = excluded.full_name,
    avatar_path = excluded.avatar_path,
    bio = excluded.bio,
    updated_at = now();

  if resolved_role = 'student' then
    insert into public.student_applications (
      profile_id,
      has_taken_courses,
      primary_interest,
      previous_courses
    )
    values (
      new.id,
      coalesce((new.raw_user_meta_data ->> 'has_taken_courses')::boolean, false),
      coalesce(new.raw_user_meta_data ->> 'primary_interest', 'Other'),
      coalesce(new.raw_user_meta_data ->> 'previous_courses', '')
    )
    on conflict (profile_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('course-thumbnails', 'course-thumbnails', true),
  ('course-media', 'course-media', false)
on conflict (id) do nothing;
