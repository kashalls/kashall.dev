/**
 * Posts navigation: each blog section with its groups and posts in order,
 * plus which section the current page is in. Shared by the Writing page, the
 * field's title, the header's menu and the previous/next links.
 */
export const useBlogNavigation = async () => {
    const route = useRoute()

    const { data: posts } = await useAsyncData('blog-sidebar-posts', () =>
        queryCollection('blog')
            .where('draft', '=', false)
            .order('date', 'DESC')
            .select('title', 'description', 'path', 'icon', 'order', 'section', 'category', 'date')
            .all(),
    )

    const rank = (list: readonly string[], id: string) => {
        const index = list.indexOf(id)
        return index === -1 ? list.length : index
    }

    // Each section's groups in order: categories for most sections,
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

    // The current post's section; none off a post.
    const current = computed(() => posts.value?.find(post => post.path === route.path)?.section)

    // Previous/next within the current section, in order; null at either end.
    const surround = computed(() => {
        const list = sections.value.find(section => section.id === current.value)?.categories.flatMap(category => category.posts) ?? []
        const index = list.findIndex(post => post.path === route.path)
        if (index === -1) return []
        const link = (post?: typeof list[number]) => post ? { title: post.title, path: post.path } : null
        return [link(list[index - 1]), link(list[index + 1])]
    })

    return { sections, current, surround }
}
