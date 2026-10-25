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

### Deployment

The site builds with Nitro's `cloudflare_module` preset and runs as a Cloudflare Worker. Prerendered pages and assets are served by [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) without invoking the Worker. [wrangler.jsonc](wrangler.jsonc) declares the bindings:

| Binding    | Type | Purpose                                                  |
| ---------- | ---- | -------------------------------------------------------- |
| `DB`       | D1   | Nuxt Content database, restored from the build's dump    |
| `CACHE`    | KV   | Nitro cache storage (GitHub and status responses)        |
| `MESSAGES` | KV   | Maintenance banner and live corner message (`/api/meta`) |

Wrangler creates these on the first deploy. The footer's visit count lives in the `VisitorCounter` Durable Object ([server/durable/visitor-counter.ts](server/durable/visitor-counter.ts)), declared under `exports` and reached through `ctx.exports` rather than a binding; Cloudflare creates its namespace on deploy. Set the runtime secrets once:

```bash
bunx wrangler secret put NUXT_GITHUB_TOKEN
bunx wrangler secret put NUXT_RESEND_API_KEY
bunx wrangler secret put NUXT_TURNSTILE_SECRET_KEY
bunx wrangler secret put NUXT_PUBLIC_TURNSTILE_SITE_KEY
```

The `maintenance` and `live` keys in `MESSAGES` show a banner above the content and a dismissible message in the corner; deleting a key hides it. Find the namespace ID with `bunx wrangler kv namespace list`, then:

```bash
bunx wrangler kv key put live "Streaming now" --namespace-id <id> --remote
bunx wrangler kv key delete live --namespace-id <id> --remote
```

Build, then preview locally or deploy:

```bash
bun run build
bun run preview
bun run deploy
```

On every push to `main`, GitHub Actions builds and deploys with `wrangler deploy`, using the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets.

Each pull request gets a [Worker Preview](https://developers.cloudflare.com/workers/previews/) named `pr-<number>`, linked in a PR comment and deleted when the PR closes. Previews use the `kashall-dev-preview` D1 database and `kashall-dev-preview-cache` KV namespace (the `previews` block in [wrangler.jsonc](wrangler.jsonc)), never production's. Their secrets are shared through the Preview base config, set once:

```bash
bunx wrangler preview base-config secret put NUXT_GITHUB_TOKEN
```

Repeat for the other secrets above. Pull requests from forks only build.

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
