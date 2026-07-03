# Supabase setup

1. Create a new Supabase project.
2. Run the migration in `supabase/migrations/20260703_0001_lss_portal_schema.sql`.
3. Create the storage bucket `pop-uploads` if it does not already exist.
4. Add admin users by inserting rows into `public.admin_users`.
5. Set these environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Notes:
- POP uploads are stored under `<user-id>/<filename>` in the `pop-uploads` bucket.
- The app expects a `profiles` row per authenticated user.
- Verified profiles are readable to the owning user and admins through RLS.
