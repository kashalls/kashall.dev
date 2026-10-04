export interface WowCharacter {
    flavor: string
    name: string
    realm: string
    level: number
    race: string
    class: string
    spec?: string
    spec_icon?: string
    faction: string
    guild?: string
    item_level: number
    achievement_points?: number
    last_login: number
    mythic_rating?: { rating: number; color: string }
    media: { avatar?: string; inset?: string; main?: string }
}

export interface OverwatchPlayer {
    battletag: string
    username: string
    title?: string
    avatar?: string
    namecard?: string
    endorsement?: number
    endorsement_frame?: string
    season?: number
    ranks: { role: string; division: string; tier: number; rank_icon: string; role_icon: string; tier_icon?: string }[]
    stats?: { games_played: number; games_won: number; time_played: number; winrate: number; kda: number }
    top_heroes: { hero: string; time_played: number; winrate: number }[]
}
