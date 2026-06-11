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
const BADGE_CDN = 'https://cdn.jsdelivr.net/gh/mezotv/discord-badges/assets'

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

export function guildTagBadgeUrl(user?: DiscordUserLike): string | null {
	const pg = user?.primary_guild
	if (!pg?.identity_enabled || !pg.badge || !pg.identity_guild_id) return null
	return `${CDN}/clan-badges/${pg.identity_guild_id}/${pg.badge}.png?size=24`
}

export const STATUS: Record<string, { color: string; label: string }> = {
	online: { color: '#23a55a', label: 'Online' },
	idle: { color: '#f0b232', label: 'Idle' },
	dnd: { color: '#f23f43', label: 'Do Not Disturb' },
	offline: { color: '#80848e', label: 'Offline' },
}

export function statusColor(status?: string): string {
	return STATUS[status ?? 'offline']?.color ?? STATUS.offline.color
}

interface BadgeFlag {
	bit: number
	asset: string
	label: string
}

const BADGE_FLAGS: BadgeFlag[] = [
	{ bit: 0, asset: 'discordstaff.svg', label: 'Discord Staff' },
	{ bit: 1, asset: 'discordpartner.svg', label: 'Partnered Server Owner' },
	{ bit: 2, asset: 'hypesquadevents.svg', label: 'HypeSquad Events' },
	{ bit: 3, asset: 'discordbughunter1.svg', label: 'Bug Hunter' },
	{ bit: 6, asset: 'hypesquadbravery.svg', label: 'HypeSquad Bravery' },
	{ bit: 7, asset: 'hypesquadbrilliance.svg', label: 'HypeSquad Brilliance' },
	{ bit: 8, asset: 'hypesquadbalance.svg', label: 'HypeSquad Balance' },
	{ bit: 9, asset: 'discordearlysupporter.svg', label: 'Early Supporter' },
	{ bit: 14, asset: 'discordbughunter2.svg', label: 'Bug Hunter Gold' },
	{ bit: 17, asset: 'discordbotdev.svg', label: 'Early Verified Bot Developer' },
	{ bit: 18, asset: 'discordmod.svg', label: 'Moderator Programs Alumni' },
	{ bit: 22, asset: 'activedeveloper.svg', label: 'Active Developer' },
]

export function userBadges(user?: DiscordUserLike): { label: string; src: string }[] {
	if (!user) return []
	const flags = user.public_flags ?? 0
	const badges = BADGE_FLAGS
		.filter(b => (flags & (1 << b.bit)) !== 0)
		.map(b => ({ label: b.label, src: `${BADGE_CDN}/${b.asset}` }))
	// Avatar decorations require Nitro, so its presence is a reliable signal.
	if (user.avatar_decoration_data) badges.push({ label: 'Nitro', src: `${BADGE_CDN}/discordnitro.svg` })
	return badges
}

const DISCORD_EPOCH = 1420070400000n

export function snowflakeToDate(id?: string): Date | null {
	if (!id) return null
	try {
		return new Date(Number((BigInt(id) >> 22n) + DISCORD_EPOCH))
	} catch {
		return null
	}
}

export function bannerUrl(id?: string, hash?: string | null, size = 600): string | null {
	if (!id || !hash) return null
	const animated = hash.startsWith('a_')
	return `${CDN}/banners/${id}/${hash}.${animated ? 'gif' : 'png'}?size=${size}`
}

interface ConnectionMeta {
	label: string
	icon: string
	color: string
	url?: (account: { id: string; name: string }) => string | null
}

const CONNECTIONS: Record<string, ConnectionMeta> = {
	github: { label: 'GitHub', icon: 'i-simple-icons-github', color: '#ededed', url: a => `https://github.com/${a.name}` },
	twitch: { label: 'Twitch', icon: 'i-simple-icons-twitch', color: '#9146ff', url: a => `https://twitch.tv/${a.name}` },
	reddit: { label: 'Reddit', icon: 'i-simple-icons-reddit', color: '#ff4500', url: a => `https://reddit.com/user/${a.name}` },
	steam: { label: 'Steam', icon: 'i-simple-icons-steam', color: '#c7d5e0', url: a => `https://steamcommunity.com/profiles/${a.id}` },
	spotify: { label: 'Spotify', icon: 'i-simple-icons-spotify', color: '#1db954', url: a => `https://open.spotify.com/user/${a.id}` },
	youtube: { label: 'YouTube', icon: 'i-simple-icons-youtube', color: '#ff0000', url: a => `https://youtube.com/channel/${a.id}` },
	twitter: { label: 'X', icon: 'i-simple-icons-x', color: '#ffffff', url: a => `https://x.com/${a.name}` },
	battlenet: { label: 'Battle.net', icon: 'i-simple-icons-battledotnet', color: '#148eff' },
	crunchyroll: { label: 'Crunchyroll', icon: 'i-simple-icons-crunchyroll', color: '#f47521' },
	instagram: { label: 'Instagram', icon: 'i-simple-icons-instagram', color: '#e4405f', url: a => `https://instagram.com/${a.name}` },
}

export function mapConnections(accounts?: { type: string; id: string; name: string }[]) {
	return (accounts ?? [])
		.map((a) => {
			const meta = CONNECTIONS[a.type]
			if (!meta) return null
			return { type: a.type, label: meta.label, icon: meta.icon, color: meta.color, name: a.name, href: meta.url?.(a) ?? null }
		})
		.filter((c): c is NonNullable<typeof c> => c !== null)
}

export type DiscordTextToken =
	| { type: 'text'; value: string }
	| { type: 'link'; value: string; href: string }
	| { type: 'emoji'; name: string; src: string }

/** Parses Discord-flavoured text (custom emoji + links + newlines) into renderable tokens per line. */
export function parseDiscordText(text?: string): DiscordTextToken[][] {
	if (!text) return []
	const emojiRe = /<(a)?:(\w+):(\d+)>/g
	const urlRe = /(https?:\/\/[^\s]+)/g

	const tokenizeText = (str: string): DiscordTextToken[] => {
		const tokens: DiscordTextToken[] = []
		let last = 0
		let m: RegExpExecArray | null
		urlRe.lastIndex = 0
		while ((m = urlRe.exec(str)) !== null) {
			if (m.index > last) tokens.push({ type: 'text', value: str.slice(last, m.index) })
			tokens.push({ type: 'link', value: m[1].replace(/^https?:\/\//, ''), href: m[1] })
			last = m.index + m[0].length
		}
		if (last < str.length) tokens.push({ type: 'text', value: str.slice(last) })
		return tokens
	}

	return text.split('\n').map((line) => {
		const tokens: DiscordTextToken[] = []
		let last = 0
		let m: RegExpExecArray | null
		emojiRe.lastIndex = 0
		while ((m = emojiRe.exec(line)) !== null) {
			if (m.index > last) tokens.push(...tokenizeText(line.slice(last, m.index)))
			tokens.push({ type: 'emoji', name: m[2], src: `${CDN}/emojis/${m[3]}.${m[1] ? 'gif' : 'png'}?size=24&quality=lossless` })
			last = m.index + m[0].length
		}
		if (last < line.length) tokens.push(...tokenizeText(line.slice(last)))
		return tokens
	})
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
	return activity.application_id ? `https://dcdn.dstn.to/app-icons/${activity.application_id}` : ''
}
