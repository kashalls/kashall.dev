// Blog sections, shown as tabs atop the sidebar. Each lists its categories in
// sidebar order; categories it doesn't list follow alphabetically. A `dated`
// section lists its posts by year, newest first, instead of by category.
// `accent` classes colour the section's tab, labels and active post. Blue,
// yellow and rose stay distinct under the common forms of colour blindness.
export const blogSections = [
    {
        id: 'homelab',
        label: 'Home Lab',
        icon: 'i-ph-house-line',
        categories: ['welcome', 'homelab', 'kubernetes', 'storage'],
        dated: false,
        accent: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', ring: 'ring-blue-500/30' },
    },
    {
        id: 'guides',
        label: 'Guides',
        icon: 'i-ph-book-open-text',
        categories: ['guides'],
        dated: false,
        accent: { text: 'text-yellow-700 dark:text-yellow-300', bg: 'bg-yellow-400/10', ring: 'ring-yellow-400/30' },
    },
    {
        id: 'blog',
        label: 'Blog',
        icon: 'i-ph-article',
        categories: [],
        dated: true,
        accent: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10', ring: 'ring-rose-500/30' },
    },
] as const

export const blogSection = (id?: string) => blogSections.find(section => section.id === id)
