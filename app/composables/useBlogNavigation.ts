import type { ContentSurroundLink } from '@nuxt/ui'

/**
 * Posts navigation: each blog section with its groups and posts in sidebar
 * order, plus which section the current page is in. Shared by the sidebar,
 * the header's mobile menu and the previous/next links.
 */
export const useBlogNavigation = async () => {
    const route = useRoute()

    const { data: posts } = await useAsyncData('blog-sidebar-posts', () =>
        queryCollection('blog')
            .where('draft', '=', false)
            .order('date', 'DESC')
            .select('title', 'sidebarTitle', 'description', 'path', 'icon', 'order', 'section', 'category', 'date')
            .all(),
    )

    const rank = (list: readonly string[], id: string) => {
        const index = list.indexOf(id)
        return index === -1 ? list.length : index
    }

    // Each section's groups in sidebar order: categories for most sections,
    // years for dated ones. Posts follow their `order`, then newest first (the
    // sort is stable, so unordered posts keep the query's order).
    const sections = computed(() => {
        const sorted = [...posts.value ?? []].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || 0)
        return blogSections
            .map((section) => {
                const inSection = section.dated
                    ? (posts.value ?? []).filter(post => post.section === section.id)
                    : sorted.filter(post => post.section === section.id)
                const groups = new Map<string, typeof inSection>()
                for (const post of inSection) {
                    const key = section.dated ? String(postDate(post.date).getFullYear()) : post.category
                    if (!groups.has(key)) groups.set(key, [])
                    groups.get(key)!.push(post)
                }
                const categories = [...groups.entries()]
                    .sort(([a], [b]) => section.dated
                        ? b.localeCompare(a)
                        : rank(section.categories, a) - rank(section.categories, b) || a.localeCompare(b))
                    .map(([id, posts]) => ({ id, title: section.dated ? id : tagLabel(id), posts }))
                return { ...section, categories, first: categories[0]?.posts[0]?.path }
            })
            .filter(section => section.first)
    })

    // The current post's section. Off a post (search), the first section's
    // groups are listed but no tab is highlighted.
    const current = computed(() => posts.value?.find(post => post.path === route.path)?.section)
    const active = computed(() => sections.value.find(section => section.id === current.value) ?? sections.value[0])

    // Previous/next within the current section, in sidebar order. UContentSurround
    // renders a missing neighbour (null) as an empty slot, though its type omits null.
    const surround = computed(() => {
        const list = active.value?.categories.flatMap(category => category.posts) ?? []
        const index = list.findIndex(post => post.path === route.path)
        if (index === -1) return []
        const link = (post?: typeof list[number]) => post ? { title: post.title, path: post.path, description: post.description } : null
        return [link(list[index - 1]), link(list[index + 1])] as ContentSurroundLink[]
    })

    return { sections, current, active, surround }
}
