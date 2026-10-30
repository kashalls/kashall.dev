// Blog sections, as the Writing page lists them. Each lists its categories in
// order; categories it doesn't list follow alphabetically. A `dated` section
// lists its posts by year, newest first, instead of by category. `accent`
// classes colour the section's labels and links; `hue` is the same colour for
// the particle field's title. Blue, yellow and rose stay distinct under the
// common forms of colour blindness.
export const blogSections = [
    {
        id: 'homelab',
        label: 'Home Lab',
        icon: 'i-ph-house-line',
        categories: ['welcome', 'homelab', 'kubernetes', 'storage'],
        dated: false,
        hue: '#60a5fa',
        accent: { text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-500/30' },
    },
    {
        id: 'guides',
        label: 'Guides',
        icon: 'i-ph-book-open-text',
        categories: ['guides'],
        dated: false,
        hue: '#fde047',
        accent: { text: 'text-yellow-700 dark:text-yellow-300', ring: 'ring-yellow-400/30' },
    },
    {
        id: 'blog',
        label: 'Blog',
        icon: 'i-ph-article',
        categories: [],
        dated: true,
        hue: '#fb7185',
        accent: { text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-500/30' },
    },
] as const

export const blogSection = (id?: string) => blogSections.find(section => section.id === id)
