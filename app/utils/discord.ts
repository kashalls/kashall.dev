/**
 * https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types
 */
export enum ActivityType {
	/** Playing {game} */
	Playing,
	/** Streaming {details} */
	Streaming,
	/** Listening to {name} */
	Listening,
	/** Watching {details} */
	Watching,
	/** {emoji} {state} */
	Custom,
	/** Competing in {name} */
	Competing,
}

const CDN = 'https://cdn.discordapp.com'

export interface DiscordUserLike {
	id: string
	avatar?: string | null
	avatar_decoration_data?: { asset: string } | null
	public_flags?: number
	primary_guild?: {
		identity_enabled?: boolean
		identity_guild_id?: string | null
		badge?: string | null
		tag?: string | null
	} | null
}

export function avatarUrl(user?: DiscordUserLike, size = 128): string | null {
	if (!user?.avatar) return null
	const animated = user.avatar.startsWith('a_')
	return `${CDN}/avatars/${user.id}/${user.avatar}.${animated ? 'gif' : 'png'}?size=${size}`
}

export function decorationUrl(user?: DiscordUserLike): string | null {
	const asset = user?.avatar_decoration_data?.asset
	return asset ? `${CDN}/avatar-decoration-presets/${asset}.png?size=96&passthrough=true` : null
}

export const STATUS: Record<'online' | 'idle' | 'dnd' | 'offline', { color: string; label: string }> = {
	online: { color: '#23a55a', label: 'Online' },
	idle: { color: '#f0b232', label: 'Idle' },
	dnd: { color: '#f23f43', label: 'Do Not Disturb' },
	offline: { color: '#80848e', label: 'Offline' },
}

export function statusColor(status?: string): string {
	return STATUS[status as keyof typeof STATUS]?.color ?? STATUS.offline.color
}

export function bannerUrl(id?: string, hash?: string | null, size = 600): string | null {
	if (!id || !hash) return null
	const animated = hash.startsWith('a_')
	return `${CDN}/banners/${id}/${hash}.${animated ? 'gif' : 'png'}?size=${size}`
}

/** Resolves an activity's large image asset to a usable image URL. */
export function activityImage(activity?: { application_id?: string | null; assets?: { large_image?: string; small_image?: string } }): string {
	if (!activity) return ''
	const asset = activity.assets?.large_image ?? activity.assets?.small_image
	if (asset) {
		if (asset.startsWith('mp:external/')) return `https://media.discordapp.net/${asset.replace('mp:', '')}`
		if (asset.startsWith('spotify:')) return `https://i.scdn.co/image/${asset.replace('spotify:', '')}`
		if (activity.application_id) return `${CDN}/app-assets/${activity.application_id}/${asset}.png`
	}
	return activity.application_id ? `https://api.ok8.sh/juno/app-icons/${activity.application_id}` : ''
}
