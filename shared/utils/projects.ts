// Projects on the Work page; /api/repos fetches their star counts. `short` is
// the name the particle field writes while one is hovered.
export const projects = [
    { name: 'External DNS for UniFi', short: 'External DNS', repo: 'home-operations/external-dns-unifi-webhook', lang: 'Go', description: 'Creates and manages your Kubernetes DNS records for UniFi Gateways.' },
    { name: 'Kromgo', short: 'Kromgo', repo: 'home-operations/kromgo', lang: 'Go', description: 'Turns PromQL queries into shareable badges and graphs for safe external consumption.' },
    { name: 'Infrastructure', short: 'Infrastructure', repo: 'waifulabs/infrastructure', lang: 'Kubernetes', description: 'The homelab cluster: Talos, Flux, Renovate and GitHub Actions.' },
    { name: 'Openterface Viewer', short: 'Openterface', repo: 'kashalls/openterface-viewer', lang: 'TypeScript', description: 'Control an Openterface KVM straight from your browser, no app install needed.' },
    { name: 'ok8.sh', short: 'ok8.sh', repo: 'kashalls/ok8.sh', lang: 'Nuxt', description: 'This site. Built with Nuxt, served from Cloudflare Workers.' },
]
