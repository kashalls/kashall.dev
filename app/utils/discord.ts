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

export function avatarUrl(id: string, avatar: string | null, size = 64): string {
	return avatar
		? `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=${size}`
		: 'https://cdn.discordapp.com/embed/avatars/0.png'
}

/** An activity's image key: `mp:` keys are proxied external images, numeric ones the app's own assets. */
export function activityImageUrl(applicationId: string | null | undefined, key?: string): string | undefined {
	if (!key) return undefined
	if (key.startsWith('mp:')) return `https://media.discordapp.net/${key.slice(3)}`
	if (applicationId && /^\d+$/.test(key)) return `https://cdn.discordapp.com/app-assets/${applicationId}/${key}.png`
	return undefined
}
