import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        // Posts live in content/posts/<slug>.md and are served at /posts/<slug>.
        blog: defineCollection({
            type: 'page',
            source: 'posts/**/*.md',
            schema: z.object({
                date: z.date(),
                // Last meaningful edit; shown beside the date when set.
                updated: z.date().optional(),
                // Sidebar tab and group; see app/utils/blogSections.ts.
                section: z.string(),
                category: z.string(),
                tags: z.array(z.string()).default([]),
                draft: z.boolean().default(false),
                // Iconify name shown beside the post in the sidebar, e.g. i-ph-hand-waving.
                icon: z.string().optional(),
                // Shorter title for the sidebar when the full one is long.
                sidebarTitle: z.string().optional(),
                // Position within its category; unordered posts follow, newest first.
                order: z.number().optional(),
            }),
        }),
        // Policies for other projects, served at /legal/<project>/<page> and not linked from the site.
        legal: defineCollection({
            type: 'page',
            source: 'legal/**/*.md',
            schema: z.object({
                updated: z.date(),
            }),
        }),
    },
})
