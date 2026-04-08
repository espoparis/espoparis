# Supabase Foundation

This folder holds the database and storage foundation for the new Next.js app.

## Local workflow

1. Install the Supabase CLI.
2. Run `supabase start`.
3. Run `supabase db reset` from the `frontend/` directory.
4. Create the first admin auth user in the local Studio or dashboard.
5. Promote that user with `npm run supabase:promote-admin -- --email you@example.com`.
6. Generate types when the schema changes:
   `npm run supabase:types`

## Migration flow

- Keep migrations small and ordered.
- Put schema changes in SQL only.
- Keep auth/session logic in Next.js server helpers.
- Use the admin client only from server-side code.

## Admin bootstrap notes

- Create the first admin auth user through local seed or the Supabase dashboard.
- The trigger in the initial migration will create the matching profile row.
- Admin approval flows should stay server-side and use the `profiles` table as the source of truth.
- The simplest local bootstrap is:
  1. sign up with the future admin email
  2. run `npm run supabase:promote-admin -- --email you@example.com`
  3. sign in again and access `/admin`

## Storage rules

- `avatars` is public.
- `course-thumbnails` is public.
- `course-media` is private and should be served with signed URLs.
- `0002_storage_policies_and_indexes.sql` adds future-proof storage policies and the main operational indexes.
