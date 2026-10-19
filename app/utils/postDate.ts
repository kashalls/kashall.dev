// Frontmatter dates like 2026-10-05 parse as UTC midnight, which formats as
// the previous day west of UTC. Rebuild them at local midnight so the
// calendar day matches what was written.
export function postDate(value: string | Date): Date {
    const date = new Date(value)
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

// The site's one date style, e.g. "Oct 5, 2026"; `year: false` drops the year
// where a list is already grouped by year.
export function formatDate(date: Date, { year = true } = {}): string {
    return date.toLocaleDateString('en-US', year
        ? { month: 'short', day: 'numeric', year: 'numeric' }
        : { month: 'short', day: 'numeric' })
}
