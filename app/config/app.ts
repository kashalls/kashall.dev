const image = "https://jordanjones.org/logo.png"
const description =
    "Versatile IT Professional Excelling in System Deployments, Network Operations, and Device Provisioning."


export default {
    head: {
        title: 'Jordan Jones',
        link: [
            { rel: 'icon', type: 'image/png', href: '/logo.png' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter&display=swap' }
        ],
        meta: [
            {
                hid: "description",
                name: "description",
                content: description,
            },
            /* Twitter */
            {
                hid: "twitter:card",
                name: "twitter:card",
                content: "summary",
            },
            {
                hid: "twitter:site",
                name: "twitter:site",
                content: "@jordpjones",
            },
            {
                hid: "twitter:creator",
                name: "twitter:creator",
                content: "@jordpjones",
            },
            {
                hid: "twitter:title",
                name: "twitter:title",
                content: "Jordan Jones",
            },
            {
                hid: "twitter:description",
                name: "twitter:description",
                content: description,
            },
            {
                hid: "twitter:image",
                name: "twitter:image",
                content: image,
            },
            /* Open-Graph */
            {
                hid: "og:type",
                name: "og:type",
                content: "website",
            },
            {
                hid: "og:site_name",
                name: "og:site_name",
                content: "jordanjones.org",
            },
            {
                hid: "og:description",
                name: "og:description",
                content: description,
            },
            {
                hid: "og:image",
                name: "og:image",
                content: image,
            }
        ]
    }
}