const description =
    "Freelance Software Engineer — integrations, full-stack & infrastructure."

// og:image and twitter:card come from defineOgImage on each page.
export default {
    head: {
        title: 'Jordan Jones',
        link: [
            { rel: 'icon', type: 'image/png', href: '/logo.png' }
        ],
        meta: [
            { name: "description", content: description },
            { property: "og:type", content: "website" },
            { property: "og:site_name", content: "Jordan Jones" },
            { property: "og:description", content: description },
        ]
    }
}
