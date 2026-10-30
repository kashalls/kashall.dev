import type { H3Event } from 'h3'
// Imported explicitly: typed routes pull this file into the app's type check,
// where the auto-imported queryCollection is the client version.
import { queryCollection } from '@nuxt/content/server'
import type { CommentAuthor, PostComment } from '#shared/types/comments'

type StoredComment = Omit<PostComment, 'isOwner'>

// The RPC stub's shape, typed here because typed routes pull this file into the
// app's type check, where the Workers runtime types would clash with the DOM's.
interface PostCommentsStub {
    list(viewerId: number | null): Promise<StoredComment[]>
    post(author: CommentAuthor, content: string, replyTo: string | null): Promise<StoredComment | null>
    heart(id: string, userId: number, hearted: boolean): Promise<Pick<PostComment, 'hearts' | 'hearted'> | null>
    remove(id: string, authorId?: number): Promise<'removed' | 'missing' | 'forbidden'>
}

/**
 * The PostComments instance for the post named by the route's `slug`, or the
 * guestbook's for `guestbook`. Only published Blog section posts have one
 * (docs and guides take no comments), so arbitrary paths can't create
 * instances. Not available under `nuxt dev`, which doesn't run the Worker entry.
 */
export const usePostComments = async (event: H3Event): Promise<PostCommentsStub> => {
    const slug = getRouterParam(event, 'slug')
    const post = slug === 'guestbook'
        ? { path: '/guestbook' }
        : await queryCollection(event, 'blog')
            .path(`/posts/${slug}`)
            .where('draft', '=', false)
            .where('section', '=', 'blog')
            .select('path')
            .first()
    if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found.' })
    return commentsFor(event, post.path)
}

/** Every place that takes comments: the guestbook, then each published Blog post. */
export const commentSources = async (event: H3Event) => {
    const posts = await queryCollection(event, 'blog')
        .where('draft', '=', false)
        .where('section', '=', 'blog')
        .select('path', 'title')
        .all()
    return [
        { slug: 'guestbook', path: '/guestbook', title: 'Guestbook' },
        ...posts.map(post => ({ slug: post.path.replace(/^\/posts\//, ''), path: post.path, title: post.title })),
    ]
}

/** The PostComments instance for a path that's already known to take comments. */
export const commentsFor = (event: H3Event, path: string): PostCommentsStub => {
    const exports = event.context.cloudflare?.context?.exports as
        { PostComments?: { getByName(name: string): PostCommentsStub } } | undefined
    if (!exports?.PostComments) throw createError({ statusCode: 503, statusMessage: 'Comments are unavailable right now.' })
    return exports.PostComments.getByName(path)
}

/** The signed-in GitHub account; commenting, hearts and removal all need one. */
export const requireCommenter = async (event: H3Event) =>
    (await requireUserSession(event, { message: 'Sign in with GitHub to join the discussion.' })).user

/** The site owner's account. Anyone else gets a 404, so the admin routes don't announce themselves. */
export const requireSiteOwner = async (event: H3Event) => {
    const { user } = await getUserSession(event)
    if (!isSiteOwner(event, user)) throw createError({ statusCode: 404, statusMessage: 'Not found.' })
    return user!
}

/** Whether the account is the site owner's. Matched by ID, which survives a rename. */
export const isSiteOwner = (event: H3Event, account: { id: number } | null | undefined) =>
    !!account && account.id === useRuntimeConfig(event).githubUserId

export const withOwner = (event: H3Event, comment: StoredComment): PostComment =>
    ({ ...comment, isOwner: isSiteOwner(event, comment.author) })
