// The GitHub account a comment was posted from.
export interface CommentAuthor {
    id: number
    login: string
    name: string | null
    avatar: string
}

export interface PostComment {
    id: string
    // The top-level comment this reply sits under; null for a top-level comment.
    threadId: string | null
    // The comment this replies to, which may itself be a reply.
    replyTo: string | null
    // null once removed.
    author: CommentAuthor | null
    content: string
    // Posted by the site owner.
    isOwner: boolean
    // Removed but kept so its replies keep their thread.
    removed: boolean
    hearts: number
    // Whether the signed-in viewer hearted it.
    hearted: boolean
    createdAt: string
}
