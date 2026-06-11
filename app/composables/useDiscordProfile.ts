export interface ConnectedAccount {
    type: string
    id: string
    name: string
    verified: boolean
}

export interface DiscordProfile {
    user: {
        id: string
        banner?: string | null
        banner_color?: string | null
        accent_color?: number | null
        bio?: string
    }
    user_profile?: {
        bio?: string
        pronouns?: string
        accent_color?: number | null
    }
    connected_accounts?: ConnectedAccount[]
    premium_type?: number
}

/**
 * Fetches the full Discord profile (banner, bio, pronouns, connections) from the
 * dstn proxy. Lanyard does not expose these fields, so we pull them separately.
 */
export const useDiscordProfile = () => {
    const profile = useState<DiscordProfile | null>('discord-profile', () => null)
    const { public: { userId } } = useRuntimeConfig()

    onMounted(async () => {
        if (profile.value || !import.meta.browser) return
        try {
            profile.value = await $fetch<DiscordProfile>(`https://dcdn.dstn.to/profile/${userId}`)
        } catch {
            // Non-fatal: the card falls back to a gradient banner and Lanyard data.
        }
    })

    return profile
}
