# SaveReel — Deployment Guide

## What's in this folder
- `index.html` — the site's frontend (already wired to call `/api/download`)
- `api/download.js` — a serverless function that talks to RapidAPI so your key never appears in the browser

## Deploy for free on Vercel

1. Create a free account at vercel.com (sign in with GitHub is easiest).
2. Push this folder to a new GitHub repository.
3. In Vercel, click "New Project" and import that repository.
4. Before the first deploy, go to Project Settings → Environment Variables and add:
   - Name: `RAPIDAPI_KEY`
   - Value: (the key you copied from your RapidAPI subscription)
5. Open `api/download.js` and replace:
   - `RAPIDAPI_HOST` with the host shown in your chosen API's code snippet
   - `RAPIDAPI_ENDPOINT` with that API's endpoint path
6. Commit, push, and Vercel redeploys automatically.
7. Test: open your live site, paste a public TikTok link, click Save.
   - If nothing comes back, open your browser's dev tools → Network tab →
     click the `/api/download` request → check the response. The `raw` field
     in the response shows exactly what the provider sent back, so you can
     match its real field names in `api/download.js` (video_url vs download_url
     vs data.play, etc. — every provider names things differently).
8. Once it works, delete the `raw` field from the response in `download.js`
   so you're not exposing the full provider payload publicly.

## Connecting your domain (savereel.com)
Buy the domain from any registrar (Namecheap, Google Domains successor, etc.),
then in Vercel: Project → Settings → Domains → add `savereel.com` and follow
the DNS instructions it gives you (usually just changing nameservers or
adding an A/CNAME record).
