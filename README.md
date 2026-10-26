## Jordan's Site

> My personal website, live at [ok8.sh](https://ok8.sh). Built with Nuxt 4 and Nuxt UI, deployed to Cloudflare Workers.

After almost continuous revisions, I've finally got my personal website to a state where I am proud of it. It's been a long journey since I first got invested in Vue, and it has grown alongside me from Nuxt 3 to Nuxt 4.

### Features

- Live Discord presence (activities, Spotify, profile banner and bio) streamed from [Juno](https://github.com/kashalls/juno)
- GitHub contribution stats, cached server-side for an hour
- Homelab stats pulled from [kromgo](https://github.com/kashalls/kromgo) badges
- Contact form protected by Cloudflare Turnstile and delivered with Resend
- A `/gateway` fallback page for hostnames that hit the gateway with no service behind them
- Pre-rendered OG images, sitemap and robots.txt

### Development

```bash
bun install
bun run dev
```

Environment variables:

| Variable                     | Purpose                                                  |
| ---------------------------- | -------------------------------------------------------- |
| `NUXT_GITHUB_TOKEN`          | Required for `/api/github` (GitHub GraphQL API)          |
| `NUXT_RESEND_API_KEY`        | Enables sending mail from the contact form               |
| `NUXT_TURNSTILE_SITE_KEY`    | Turnstile site key (dev uses the always-pass test keys)  |
| `NUXT_TURNSTILE_SECRET_KEY`  | Turnstile secret for server-side verification            |
| `NUXT_PUBLIC_SITE_URL`       | Overrides the canonical site URL                         |
| `NUXT_SESSION_PASSWORD`      | Seals the session cookie (32+ characters; dev generates one into `.env`) |
| `NUXT_OAUTH_GITHUB_CLIENT_ID` | GitHub OAuth app client ID for sign-in at `/auth/github` |
| `NUXT_OAUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret                       |

### Deployment

The site builds with Nitro's `cloudflare_module` preset and runs as a Cloudflare Worker. Prerendered pages and assets are served by [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) without invoking the Worker. [wrangler.jsonc](wrangler.jsonc) declares the bindings:

| Binding    | Type | Purpose                                                  |
| ---------- | ---- | -------------------------------------------------------- |
| `DB`       | D1   | Nuxt Content database, restored from the build's dump    |
| `CACHE`    | KV   | Nitro cache storage (GitHub and status responses)        |
| `MESSAGES` | KV   | Maintenance banner and other site messages (`/api/meta`) |

They're `ok8-sh-db`, `ok8-sh-cache` and `ok8-sh-messages`. The footer's visit count lives in the `VisitorCounter` Durable Object ([server/durable/visitor-counter.ts](server/durable/visitor-counter.ts)), declared under `exports` and reached through `ctx.exports` rather than a binding; Cloudflare creates its namespace on deploy. Set the runtime secrets once:

```bash
bunx wrangler secret put NUXT_GITHUB_TOKEN
bunx wrangler secret put NUXT_RESEND_API_KEY
bunx wrangler secret put NUXT_TURNSTILE_SECRET_KEY
bunx wrangler secret put NUXT_PUBLIC_TURNSTILE_SITE_KEY
bunx wrangler secret put NUXT_SESSION_PASSWORD
bunx wrangler secret put NUXT_OAUTH_GITHUB_CLIENT_ID
bunx wrangler secret put NUXT_OAUTH_GITHUB_CLIENT_SECRET
```

GitHub sign-in needs an [OAuth app](https://github.com/settings/developers) whose callback URL is `https://ok8.sh/auth/github`. GitHub only redirects to that callback's host, so local dev and Previews each need their own OAuth app (callback `http://localhost:3000/auth/github` for dev).

`/api/meta` serves the `maintenance` and `live` keys in `MESSAGES`. A `maintenance` value shows as a banner above the content and deleting the key hides it; `live` isn't displayed yet.

```bash
bunx wrangler kv key put maintenance "The contact form is down" --binding MESSAGES --remote
bunx wrangler kv key delete maintenance --binding MESSAGES --remote
```

Build, then preview locally or deploy:

```bash
bun run build
bun run preview
bun run deploy
```

[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) builds every push from the connected repository with `bun run build`. Pushes to `main` deploy with `wrangler deploy`; the Bun version comes from `packageManager` in [package.json](package.json).

Every other branch gets a [Worker Preview](https://developers.cloudflare.com/workers/previews/) named after the branch, linked in a pull request comment. Cloudflare evicts the oldest Previews past the plan's limit; delete one sooner with `bunx wrangler preview delete --name <branch>`. Previews use the `ok8-sh-preview` D1 database and the `ok8-sh-preview-cache` and `ok8-sh-preview-messages` KV namespaces (the `previews` block in [wrangler.jsonc](wrangler.jsonc)), never production's. Their secrets are shared through the Preview base config, set once:

```bash
bunx wrangler preview base-config secret put NUXT_GITHUB_TOKEN
```

Repeat for the other secrets above.

### 💖 Sponsors

<p align="center">
    <a href="https://github.com/sponsors/kashalls">
        <img src="https://cdn.jsdelivr.net/gh/kashalls/kashalls/sponsors/sponsors.svg" />
    </a>
</p>

### Powered By

- [Nuxt](https://nuxt.com) and [Nuxt UI](https://ui.nuxt.com)
- [Juno](https://github.com/kashalls/juno) (for Discord presence)
- [Resend](https://resend.com) and [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
