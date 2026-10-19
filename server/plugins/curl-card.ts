/**
 * `curl ok8.sh` gets a terminal business card instead of the HTML page.
 */
const CLI_AGENT = /^(curl|wget|httpie|xh)\//i

const purple = (s: string) => `\x1b[38;5;141m${s}\x1b[0m`
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`

const links = [
    ['web', 'https://ok8.sh'],
    ['posts', 'https://ok8.sh/posts'],
    ...socials.map(social => [social.label.toLowerCase(), social.to]),
]

function card(build: { sha: string, ref: string, time: string }) {
    const lines = [
        '',
        `  ${bold(purple('Jordan Jones'))} ${dim('·')} Platform Engineer`,
        `  ${dim('Kubernetes infrastructure, and tooling that makes platforms more extensible.')}`,
        `  ${dim('Eugene, Oregon')}`,
        '',
        ...links.map(([label, url]) => `  ${purple(label!.padEnd(10))}${url}`),
        '',
        `  ${dim('Say hi: open the site and press ⌘K → Email me.')}`,
    ]
    if (build.sha) {
        lines.push(`  ${dim(`deployed from ${build.sha.slice(0, 7)} (${build.ref}), built ${build.time}`)}`)
    }
    return `${lines.join('\n')}\n\n`
}

export default defineNitroPlugin((nitroApp) => {
    // Prerendered pages are served by Nitro's static asset handler, which runs
    // before server middleware, so this has to go at the front of the stack.
    nitroApp.h3App.stack.unshift({
        route: '/',
        handler: defineEventHandler((event) => {
            if (getRequestURL(event).pathname !== '/') return
            appendResponseHeader(event, 'Vary', 'User-Agent')
            if (!CLI_AGENT.test(getRequestHeader(event, 'user-agent') ?? '')) return
            setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
            return card(useRuntimeConfig(event).public.build)
        }),
    })
})
