// Frontmatter dates like 2026-10-05 parse as UTC midnight, which formats as
// the previous day west of UTC. Rebuild them at local midnight so the
// calendar day matches what was written.
export function postDate(value: string | Date): Date {
    const date = new Date(value)
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}
