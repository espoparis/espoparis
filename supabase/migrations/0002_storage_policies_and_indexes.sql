create index if not exists profiles_role_approval_created_idx
on public.profiles (role, approval_status, created_at desc);

create index if not exists course_reviews_course_created_idx
on public.course_reviews (course_id, created_at desc);

create index if not exists enrollments_course_status_applied_idx
on public.enrollments (course_id, status, applied_at desc);

create index if not exists enrollments_student_status_applied_idx
on public.enrollments (student_id, status, applied_at desc);

drop policy if exists "Public avatar assets are readable" on storage.objects;
create policy "Public avatar assets are readable"
on storage.objects
for select
using (bucket_id = 'avatars');

drop policy if exists "Public course thumbnails are readable" on storage.objects;
create policy "Public course thumbnails are readable"
on storage.objects
for select
using (bucket_id = 'course-thumbnails');

drop policy if exists "Users can manage their own avatar uploads" on storage.objects;
create policy "Users can manage their own avatar uploads"
on storage.objects
for all
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "Teachers and admins can manage course thumbnails" on storage.objects;
create policy "Teachers and admins can manage course thumbnails"
on storage.objects
for all
using (
  bucket_id = 'course-thumbnails'
  and (storage.foldername(name))[1] = 'courses'
  and exists (
    select 1
    from public.courses c
    where c.id::text = (storage.foldername(name))[2]
      and (c.teacher_id = auth.uid() or public.is_admin())
  )
)
with check (
  bucket_id = 'course-thumbnails'
  and (storage.foldername(name))[1] = 'courses'
  and exists (
    select 1
    from public.courses c
    where c.id::text = (storage.foldername(name))[2]
      and (c.teacher_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "Teachers and admins can manage private course media files" on storage.objects;
create policy "Teachers and admins can manage private course media files"
on storage.objects
for all
using (
  bucket_id = 'course-media'
  and (storage.foldername(name))[1] = 'courses'
  and exists (
    select 1
    from public.courses c
    where c.id::text = (storage.foldername(name))[2]
      and (c.teacher_id = auth.uid() or public.is_admin())
  )
)
with check (
  bucket_id = 'course-media'
  and (storage.foldername(name))[1] = 'courses'
  and exists (
    select 1
    from public.courses c
    where c.id::text = (storage.foldername(name))[2]
      and (c.teacher_id = auth.uid() or public.is_admin())
  )
);
