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

export const DISCORD_USER_ID = '201077739589992448'

const CDN = 'https://cdn.discordapp.com'
const DCDN = 'https://dcdn.dstn.to'

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

/** dcdn 404s when the user has no banner. */
export function bannerUrl(id: string, size = 600): string {
	return `${DCDN}/banners/${id}?size=${size}`
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
	return activity.application_id ? `${DCDN}/app-icons/${activity.application_id}` : ''
}
