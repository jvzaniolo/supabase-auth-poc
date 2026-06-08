# Supabase Auth POC

CSR React app built with Vite and Supabase Auth.

## Local app

```sh
npm install
npm run dev
```

The app uses these Vite env vars:

```sh
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

## Auth flow

- Continue with Google through Supabase OAuth.
- Continue with email sends a passwordless magic link.
- After email submission, the app shows a check-your-inbox screen.
- Continue with password signs in with email and password.

## Custom Auth Emails

The custom passwordless email is implemented as a Supabase Edge Function:

```txt
supabase/functions/send-auth-email/index.ts
supabase/functions/send-auth-email/_templates/magic-link.tsx
```

It uses:

- Supabase Auth Send Email Hook
- React Email
- Resend
- `standardwebhooks` verification for the Supabase hook payload

### Required secrets

Set these in the Supabase project before deploying/using the hook:

```sh
supabase secrets set RESEND_API_KEY="re_..."
supabase secrets set SEND_EMAIL_HOOK_SECRET="v1,whsec_..."
supabase secrets set AUTH_EMAIL_FROM="Supabase Auth POC <auth@yourdomain.com>"
```

`AUTH_EMAIL_FROM` is optional in code, but production email should use a verified Resend domain.

### Deploy function

```sh
supabase functions deploy send-auth-email --no-verify-jwt
```

### Configure Supabase Auth hook

In the Supabase Dashboard:

1. Go to `Authentication` -> `Hooks`.
2. Enable `Send Email`.
3. Set the hook URL to:

```txt
https://<project-ref>.supabase.co/functions/v1/send-auth-email
```

4. Copy the generated hook secret and set it as `SEND_EMAIL_HOOK_SECRET`.
5. Keep email passwordless enabled so `supabase.auth.signInWithOtp({ email })` triggers the hook.

The React app still calls Supabase normally. Supabase invokes this function whenever it needs to send the auth email.

## Redirect URLs

The production app URL is:

```txt
https://supabase-auth-poc.vercel.app
```

Add these URLs in Supabase Dashboard under `Authentication` -> `URL Configuration`:

```txt
https://supabase-auth-poc.vercel.app
http://127.0.0.1:5173
http://127.0.0.1:5174
```
