## Jordan's Site

> My personal website, live at [kashall.dev](https://kashall.dev). Built with Nuxt 4 and Nuxt UI, shipped as a container image.

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

The [Dockerfile](Dockerfile) builds a Nitro `node-server` output with bun and ships it on a distroless Node image, listening on port `3000`.

On every push to `main` and on each release, GitHub Actions builds a signed multi-arch (`amd64`/`arm64`) image with an SBOM and publishes it to `ghcr.io/kashalls/kashall.dev`.

```bash
docker run --rm -p 3000:3000 ghcr.io/kashalls/kashall.dev:main
```

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
