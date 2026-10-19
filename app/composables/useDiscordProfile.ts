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
 * Fetches the Discord profile (banner and colours) from juno. Lanyard does not
 * expose these fields, so we pull them separately.
 */
export const useDiscordProfile = () => {
    const profile = useState<DiscordProfile | null>('discord-profile', () => null)

    onMounted(async () => {
        if (profile.value || !import.meta.browser) return
        try {
            profile.value = await $fetch<DiscordProfile>(`https://api.ok8.sh/juno/profile`)
        } catch {
            // Non-fatal: the card falls back to a gradient banner and Lanyard data.
        }
    })

    return profile
}
