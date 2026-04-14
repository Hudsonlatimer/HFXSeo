# Deployment

This project is configured for Netlify using the `@netlify/plugin-nextjs` plugin. The plugin handles server-side rendering, API routes, and all Next.js-specific features automatically.

---

## Prerequisites

- A [Netlify](https://netlify.com) account
- This repository pushed to GitHub

---

## Deploy to Netlify

### Option 1: Netlify Dashboard (recommended)

1. Log in to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Select your GitHub repository
4. Netlify auto-detects the `netlify.toml` -- no build settings to configure
5. Click "Deploy site"

### Option 2: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## Environment Variables

After the first deploy, set your API keys in the Netlify dashboard:

1. Go to Site Settings > Environment Variables
2. Add the following:

| Variable              | Value                    |
|-----------------------|--------------------------|
| `PAGESPEED_API_KEY`   | Your Google API key      |
| `HUGGING_FACE_API_KEY`| Your Hugging Face token  |

3. Trigger a redeploy (Deploys > Trigger Deploy > Deploy site)

---

## Custom Domain (hfxseo.ca)

### DNS Configuration

1. In Netlify: Domain Management > Add custom domain > enter `hfxseo.ca`
2. At your domain registrar, set the nameservers to Netlify's:
   - `dns1.p06.nsone.net`
   - `dns2.p06.nsone.net`
   - `dns3.p06.nsone.net`
   - `dns4.p06.nsone.net`

   (Netlify may assign different nameservers -- check the dashboard for your specific values.)

3. Alternatively, if you prefer to keep your current DNS provider, add a CNAME record:
   - Host: `@` or blank
   - Value: `your-site-name.netlify.app`

### HTTPS

Netlify provisions a free SSL certificate via Let's Encrypt automatically once DNS propagates. No action needed.

### www Redirect

Netlify handles `www.hfxseo.ca` -> `hfxseo.ca` redirects automatically when both domains are configured.

---

## Build Details

The `netlify.toml` specifies:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

- **Build command**: Runs `next build`, producing the optimized production output
- **Publish directory**: `.next` is used by the Netlify plugin to deploy both static and server-rendered content
- **Node version**: Pinned to Node 20 for consistency
- **Plugin**: `@netlify/plugin-nextjs` translates Next.js output into Netlify Functions and Edge Functions

---

## Troubleshooting

**Build fails with "missing environment variable"**
The build itself does not require API keys. They are only used at runtime by the `/api/analyze` route. If the build fails, check the build log for syntax or dependency errors.

**API route returns 500 in production**
Verify that environment variables are set in the Netlify dashboard (not in `.env.local`, which is only for local development).

**Stale deploy after changing environment variables**
Trigger a manual redeploy from the Netlify dashboard. Environment variable changes do not automatically trigger a new build.
