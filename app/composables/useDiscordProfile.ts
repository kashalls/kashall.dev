export interface DiscordProfile {
    user: {
        id: string
        banner?: string | null
        banner_color?: string | null
        accent_color?: number | null
    }
    user_profile?: {
        accent_color?: number | null
    }
    premium_type?: number
}

/**
 * Fetches the Discord profile (banner colour) from dcdn. Lanyard does not
 * expose these fields, so we pull them separately. dcdn's terms forbid
 * polling, so this runs once per page load.
 */
export const useDiscordProfile = () => {
    const profile = useState<DiscordProfile | null>('discord-profile', () => null)

    onMounted(async () => {
        if (profile.value || !import.meta.browser) return
        try {
            profile.value = await $fetch<DiscordProfile>(`https://dcdn.dstn.to/profile/${DISCORD_USER_ID}`)
        } catch {
            // Non-fatal: the card falls back to a gradient banner and Lanyard data.
        }
    })

    return profile
}
