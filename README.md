This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Troubleshooting

### `TypeError: Failed to fetch` from `@supabase/auth-js` (`_refreshAccessToken` / `_recoverAndRefresh`)

**Symptom:** When any page loads, the Next.js dev overlay shows `Console TypeError: Failed to fetch`. The stack trace points into `SupabaseAuthClient._refreshAccessToken` → `_recoverAndRefresh` → `_initialize`.

**Cause:** When the Supabase browser client starts, it finds the login session saved in the browser. It then tries to refresh the access token by calling `NEXT_PUBLIC_SUPABASE_URL/auth/v1/token`. If that host can't be reached, the browser's `fetch` throws `Failed to fetch`.

In our case, the project URL `https://hhbskoizphvvcxvgpmib.supabase.co` no longer resolves in DNS. Google (8.8.8.8) and Cloudflare (1.1.1.1) both return *Non-existent domain*, while `supabase.com` itself works. That means the Supabase project was paused or deleted, or the URL is wrong. The app code was not the cause.

**How we diagnosed it:**

```bash
# Network is fine
curl -I https://supabase.com
# Project host does not exist -> NXDOMAIN
nslookup hhbskoizphvvcxvgpmib.supabase.co 8.8.8.8
```

**Fix:**

1. Open the [Supabase dashboard](https://supabase.com/dashboard) and check the project:
   - If it is **paused**, click **Restore project** and wait until it is healthy.
   - If it was **deleted**, create a new project, run `schema.sql` in the SQL editor, and turn the auth providers back on.
2. Copy the **Project URL** and **anon / publishable key** from *Project Settings → API* into `.env.local`. Make sure those lines are not commented out with `#`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```
   If you changed the project, update the OAuth redirect URLs too (`/auth/callback`).
3. Restart the dev server (`npm run dev`), because `NEXT_PUBLIC_*` variables are only read at startup.
4. Clear the old session from the browser: DevTools → Application → delete the `sb-*` cookies and localStorage keys for `localhost:3000`, then sign in again.

**Code change made:** [lib/supabase/client.ts](lib/supabase/client.ts) now checks that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set. If either is missing, it throws a clear error instead of failing later with a confusing network error.
