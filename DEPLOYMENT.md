# Deployment

## Vercel

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
- Root directory: repository root (the folder containing `package.json`)

## Supabase environment variables

Configure these in Vercel under Project Settings → Environment Variables, with the correct values for the Supabase project:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Set them for Production (and Preview if needed). Vite embeds `VITE_` variables at build time, so redeploy after changing them. Never put a Supabase `service_role` or secret key in a `VITE_` variable or browser code.
