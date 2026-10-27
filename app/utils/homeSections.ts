// Front page sections, shared by the page (about band + tabs) and the
// bottom-bar nav that scrolls between them.
export const homeSections = [
    { id: 'about', label: 'About', icon: 'i-ph-user' },
    { id: 'writing', label: 'Writing', icon: 'i-ph-article' },
    { id: 'live', label: 'Live', icon: 'i-ph-broadcast' },
    { id: 'games', label: 'Games', icon: 'i-ph-game-controller' },
] as const

export type HomeTab = Exclude<typeof homeSections[number]['id'], 'about'>

export const useHomeTab = () => useState<HomeTab>('home-tab', () => 'writing')

// Everything below the about band lives in one tab group, so non-about ids
// switch the tab and scroll to the group instead of to a section of their own.
export async function showHomeSection(id: string, reduced: boolean) {
    if (id !== 'about') useHomeTab().value = id as HomeTab
    await nextTick()
    document.getElementById(id === 'about' ? 'about' : 'home-tabs')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}
