import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        // Posts live in content/blog/<slug>.md and are served at /blog/<slug>.
        blog: defineCollection({
            type: 'page',
            source: 'blog/**/*.md',
            schema: z.object({
                date: z.date(),
                tags: z.array(z.string()).default([]),
                draft: z.boolean().default(false),
            }),
        }),
    },
})
