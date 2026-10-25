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

| Binding | Type | Purpose                                               |
| ------- | ---- | ----------------------------------------------------- |
| `DB`    | D1   | Nuxt Content database, restored from the build's dump |
| `CACHE` | KV   | Nitro cache storage (GitHub and status responses)     |

Wrangler creates both on the first deploy. Set the runtime secrets once:

```bash
bunx wrangler secret put NUXT_GITHUB_TOKEN
bunx wrangler secret put NUXT_RESEND_API_KEY
bunx wrangler secret put NUXT_TURNSTILE_SECRET_KEY
bunx wrangler secret put NUXT_PUBLIC_TURNSTILE_SITE_KEY
```

Build, then preview locally or deploy:

```bash
bun run build
bun run preview
bun run deploy
```

On every push to `main`, GitHub Actions builds and deploys with `wrangler deploy`, using the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets. Pull requests only build.

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
