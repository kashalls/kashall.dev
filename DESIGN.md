# Design

How the site looks and moves, and why. Every page uses the particle field layout (`app/layouts/field.vue`), including the error page and `/gateway`.

## Principles

- **A place, not a template.** The site should feel like somewhere you visit. Avoid card grids, dashboards and anything that reads as a stock UI kit.
- **The particle field is the identity.** Motion and personality come from the nebula, not from decoration around it. Everything else stays quiet so the field stays the memorable thing.
- **No literal metaphors.** Earlier drafts dressed the site as an engineering drawing, a server rack and a Kubernetes scheduler; they read as gimmicks. The anime side shows through the particles (the banner's eyes), not as plain images.
- **Colour carries meaning.** Every hue says something: which page you're on, which part of my work a phrase is about, a language, a service's health.
- **Motion answers people.** Ambient motion is limited to the field's drift and the eyes' blinking. Everything else moves because someone did something, and nothing moves under reduced motion.

## Colour

All colours are defined in `app/layouts/field.vue` unless noted.

### Text

| Token    | Value                       | Use                                       |
| -------- | --------------------------- | ----------------------------------------- |
| `--fg`   | `#efebfa`                   | Headings, titles, emphasised text         |
| `--fg-2` | `#b2acc9`                   | Body text                                 |
| `--fg-3` | `#7c7697`                   | Meta text: dates, repo paths, labels      |
| `--rule` | `rgb(194 165 255 / 0.18)`   | Dividers between list items, scrollbars   |

The background is the field itself on black (`#000`).

### Page hues

Each page has one hue. It colours the page's particle title, the nav marker under the current page (`--accent`) and its links and hovers.

| Page    | Hue       | Why                               |
| ------- | --------- | --------------------------------- |
| Home    | `#c2a5ff` | Lavender, the site's default      |
| About   | `#d9c6ff` | Light lavender: who I am          |
| Work    | `#5fb2ff` | The blue iris: my work            |
| Writing | `#ff7ac8` | Pink, from the banner's hair      |
| Guestbook | `#46e08c` | Green: a welcome                |
| A post  | Its section's `hue`               | See below                         |
| Search, Legal | `#c2a5ff` | The site's default          |
| Errors, Gateway | `#ff7a6b` | Red: something isn't there or isn't working |

Posts take the hue of their section, from `hue` in `app/utils/blogSections.ts`: Home Lab `#60a5fa`, Guides `#fde047`, Blog `#fb7185` (Tailwind's blue-400, yellow-300 and rose-400, so they match the sections' `accent` classes). The particle title shows the section's name, and re-forms when you move to a post in another section.

The particle title is a gradient from `#f4eeff` (near white) into the page's hue, with a glow in the hue at 85% opacity.

### Intro tones

The home intro and the About page colour key phrases by what they're about, one hue per sentence. The words around them stay `--fg-2`, so the phrases stand out. All three come from the banner art.

| Class        | Token        | Value     | Meaning                         |
| ------------ | ------------ | --------- | ------------------------------- |
| `.tone-who`  | `--tone-who` | `#d9c6ff` | Who I am (lavender)             |
| `.tone-work` | `--tone-work`| `#5fb2ff` | My main work (the blue iris)    |
| `.tone-side` | `--tone-side`| `#ff9b4a` | Side work (the orange iris)     |

Usage: put the class on the sentence and wrap the phrases in `<span>`:

```html
<p class="tone-work">I design and maintain <span>Kubernetes infrastructure</span> and write tooling.</p>
```

Don't go back to a different colour per phrase; eight unrelated hues read as noise and compete with the eyes.

### Meaningful colours

| Where                    | Value                                  | Source                               |
| ------------------------ | -------------------------------------- | ------------------------------------ |
| Go                       | `#00add8`                              | GitHub's language colour             |
| Kubernetes               | `#5b8def`                              | Kubernetes blue, lifted for black    |
| TypeScript               | `#4f94e0`                              | GitHub's colour, lifted for black    |
| Nuxt                     | `#00dc82`                              | Nuxt green                           |
| Discord status           | `STATUS` in `app/utils/discord.ts`     | Discord's own status colours         |
| Spotify (presence card)  | `#1ed760`                              | Spotify green                        |
| Maintenance message      | `#ffb547` (`--notice`)                 | Amber: a warning, not a failure      |
| Social icons (About)     | `color` in `shared/utils/socials.ts`   | Each brand's colour, lifted for black; email is the site lavender |
| Post sections            | `accent` and `hue` in `app/utils/blogSections.ts`| Blue, yellow and rose; colour-blind safe |

### Nuxt UI components

Post content (callouts, steps, code groups, accordions), comments and inputs are still Nuxt UI components. Inside the field, Nuxt UI's colour variables (`--ui-primary`, `--ui-text-*`, `--ui-bg-*`, `--ui-border-*`) point at the field's own (see the `.field` block in `app/layouts/field.vue`), so they take this palette without being rewritten. `--ui-primary` follows the page's hue, so a Guides post's links and highlights are yellow.

## Type

| Face                         | Use                                                         |
| ---------------------------- | ----------------------------------------------------------- |
| PP Neue Machina Inktrap      | `font-display`: the name, particle titles, project names, section headings |
| Inter                        | `font-sans`: body text and UI                               |
| JetBrains Mono               | `font-mono`: small technical readouts only                  |

- The name on the home page is set huge (up to 10.5rem), tightly tracked (`-0.035em`) with a line height of 0.82, and sits at the very bottom of the screen.
- Body copy stays under about 60 characters a line (`max-width: 60ch`) at a line height of 1.5 to 1.65.
- The home intro uses `text-wrap: balance` so its lines come out even, with 0.9rem between sentences.
- Use non-breaking hyphens (`&#8209;`) in compounds like "Full‑stack" so they don't break at the hyphen.
- Sentence case everywhere. No all-caps labels.

## Layout

- **Home:** the eyes fill the upper part of the field. The intro and the name sit bottom-left over a darkened corner of the field, with your Discord presence above them (`app/components/Home/Presence.vue`): your status and custom status on one line, then a stack of small cards, one for Spotify (album art, a progress bar) and one per game or app (its art, details and elapsed time). The front card shows and the rest peek out behind it; hovering, or "+N more" on touch screens, fans them out.
- **Intro:** the first landing on home in a session (`kashall-intro-seen` in session storage, so once per tab until it's closed) plays an intro: the page is hidden while the dust gathers into the banner with the eyes shut, the eyes open sleepily (half, a drowsy dip, then open), and the nav and home content fade in one after another. Any click, key, scroll or touch skips to the page. It never plays under reduced motion, without WebGL, or when the first page isn't home, and the page shows after six seconds even if the app never starts.
- **Pages:** content sits in a column on the left (`min(38rem, 46vw)`) over a darkened side of the field. The page's title is written large in particles on the right, with the eyes faint above it. On tall screens the title moves to the top and the content goes below it.
- **Nav:** a bar across the top with the J logo (`public/jordanjones.svg`, linking home; hidden on home, where the name is already huge) and the four pages. The current page is marked by a single glowing particle in its hue.
- **Posts:** a single column (`min(46rem, 56vw)`, wider than other pages for code and tables): section and category, the title in the display face, description, date, updated date and tags, then the post, an edit link, previous and next in the section, and comments on Blog posts. The particle title on the right is the section. On wide screens an "On this page" list sits bottom right over the field and marks the heading being read.
- **Errors and the gateway:** the particle title is the status code (502 on the gateway), with the status as the column's heading and the way home under it.
- **Writing:** the index of every post, grouped by section (in its hue) and category, with search and RSS at the top. Search results (`/posts?q=`) use the same column.
- **Guestbook:** a line inviting a hello, then the same comment thread Blog posts use (GitHub sign-in, replies, hearts), stored in its own `PostComments` instance named `/guestbook`.
- **Admin (`/admin`):** only for the site owner (a 404 for anyone else signed in, a sign-in prompt when signed out). The site messages, then "Needs a reply" (comments and guestbook entries you haven't answered in their thread), then everything, newest first, each with Reply and Remove.
- **Lists:** items are separated by thin `--rule` lines with even spacing; only the first item in a list drops its top padding.
- **Maintenance message:** when the `maintenance` key is set in the `MESSAGES` KV namespace (see `server/api/meta.get.ts`), a short line with an amber particle sits in the bottom right corner on wide screens, and under the nav on tall ones. A post's "On this page" list moves up to make room.
- **Scrolling:** content fades out under the nav bar (a black-to-clear strip behind the bar on every page but home).

## The particle field

The field is the nebula renderer (`app/utils/nebulaRenderer.ts`, `app/assets/shaders/nebula.vert.glsl`): a full-screen grid of particles (5 CSS px apart) that take their colour from an image. The layout paints an image for each state of the page on a canvas and hands it to the renderer.

### What each view paints

Each painting is `960px` wide at the screen's aspect ratio, so the renderer's cover fit doesn't crop it. It contains:

1. The nebula (`/nebula.jpg`), at full strength on home and 55% on pages.
2. The banner's eyes, with feathered edges so the hair dissolves into the nebula; full strength on home and 30 to 35% on pages.
3. A dark gradient where the content sits.
4. On pages, the title.

### Page changes

`morph()` crossfades the field to the next painting over 1.6s, each particle on its own beat. Only particles inside a mask of the outgoing and incoming titles swirl; the nebula and eyes fade in place. When Work borrows the title for a hovered project, the morph runs over 0.8s with a gentler swirl.

### The eyes

The eyes come from the Discord banner (`bannerUrl()` in `app/utils/discord.ts`).

- **Geometry:** the eye outlines are measured by hand in `EYES` in `app/layouts/field.vue`, in the banner's own pixels at 1024px wide. `T` is the top of the upper lash band, `U` its lower edge (the top of the open eye), `L` the lower lash line, `white` the visible eye's x span and `iris` the iris's centre and radii.
- **Following the cursor:** the irises are a separate layer. The shader shifts them every frame towards the renderer's smoothed pointer (0.25s follow), up to 22px across and 6px down in banner pixels, reaching full deflection 35% of the screen away. A mask keeps them inside the eye opening. When the pointer leaves, they ease back to centre.
- **Blinking:** every 2.5 to 6.5s, with a 1 in 5 chance of a double blink. A blink is five quick frames (half closed, shut, held, half open, open) over about 250ms with no swirl. To close an eye, each column of the art's own upper lash band slides down to the lower lash, and the gap is filled with the skin colour just above the lashes, so the linework and shading stay the artist's.
- **Easter egg:** clicking or tapping an eye makes that eye shut first and the other catch up late. Nothing hints at it.

**If the Discord banner changes,** re-measure `EYES` against the new art, or the lids will close in the wrong place. Rendering a zoomed crop of each eye with a pixel grid over it makes this quick.

## Motion and accessibility

- **Reduced motion** (the system setting, or the toggle in the display menu) stops the field's animation, the blinking, the gaze and the page transitions. The renderer paints one settled frame instead.
- **Without WebGL,** or on a software renderer, the painted image is shown as a still background, crossfading between pages.
- If the renderer can't keep its lowest quality step at its frame rate, it hands over to the still image.
- The particle title is decorative; each page also has a real `<h1>`, visually hidden while the field is live and shown when it isn't.
- Content leaves in 220ms and arrives as the particles settle (from 450ms), staggered by 70ms per block.

## Adding a page to the field

1. Create the page with `definePageMeta({ layout: 'field', pageTransition: { name: 'column', mode: 'out-in' } })`.
2. Wrap its content in `<main class="column">` with an `<h1>`.
3. Add it to `views` in `app/layouts/field.vue` with a label, path and hue. Give it a hue that means something, and add it to the table above.
4. Add it to the command palette's Pages group (`app/components/Layout/CommandPalette.vue`).

## To do

- Bring the command palette to the field layout. The contact dialog is mounted on the field (the gateway opens it) but still looks like a Nuxt UI modal.
- Nothing uses the default layout any more, so it and its Nuxt UI chrome (`UHeader`, the glass panels) can go.
- Check the production `NUXT_GITHUB_TOKEN`; without a working one, `/api/repos` falls back to GitHub's unauthenticated rate limit.
