/// <reference types="@cloudflare/workers-types" />
import { DurableObject } from 'cloudflare:workers'
import type { CommentAuthor, PostComment } from '#shared/types/comments'

// Whether a comment is the owner's is decided per request (see withOwner).
export type StoredComment = Omit<PostComment, 'isOwner'>

type CommentRow = {
    id: string
    thread_id: string | null
    reply_to: string | null
    author_id: number | null
    author_login: string | null
    author_name: string | null
    author_avatar: string | null
    content: string
    removed: number
    created_at: string
    hearts: number
    hearted: number
}

const toComment = (row: CommentRow): StoredComment => ({
    id: row.id,
    threadId: row.thread_id,
    replyTo: row.reply_to,
    author: row.author_id === null
        ? null
        : { id: row.author_id, login: row.author_login!, name: row.author_name, avatar: row.author_avatar! },
    content: row.content,
    removed: !!row.removed,
    hearts: row.hearts,
    hearted: !!row.hearted,
    createdAt: row.created_at,
})

/**
 * One post's comments, one instance per post path (see usePostComments).
 * Exported from server/entry.ts. Comments and hearts belong to GitHub accounts,
 * identified by their numeric ID.
 */
export class PostComments extends DurableObject {
    constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
        super(ctx, env)
        ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS comments (
            id TEXT PRIMARY KEY,
            thread_id TEXT,
            reply_to TEXT,
            author_id INTEGER,
            author_login TEXT,
            author_name TEXT,
            author_avatar TEXT,
            content TEXT NOT NULL,
            removed INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
        )`)
        ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS hearts (
            comment_id TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            PRIMARY KEY (comment_id, user_id)
        )`)
    }

    /** viewerId is the signed-in viewer's GitHub ID, for `hearted`. */
    list(viewerId: number | null): StoredComment[] {
        return this.ctx.storage.sql.exec<CommentRow>(`
            SELECT c.*,
                (SELECT COUNT(*) FROM hearts h WHERE h.comment_id = c.id) AS hearts,
                EXISTS (SELECT 1 FROM hearts h WHERE h.comment_id = c.id AND h.user_id = ?) AS hearted
            FROM comments c ORDER BY c.created_at`, viewerId).toArray().map(toComment)
    }

    /** Returns null when the comment being replied to doesn't exist or was removed. */
    post(author: CommentAuthor, content: string, replyTo: string | null): StoredComment | null {
        let threadId: string | null = null
        if (replyTo) {
            const parent = this.find(replyTo)
            if (!parent || parent.removed) return null
            threadId = parent.thread_id ?? parent.id
        }
        const comment: StoredComment = {
            id: crypto.randomUUID(),
            threadId,
            replyTo,
            author,
            content,
            removed: false,
            hearts: 0,
            hearted: false,
            createdAt: new Date().toISOString(),
        }
        this.ctx.storage.sql.exec(
            `INSERT INTO comments (id, thread_id, reply_to, author_id, author_login, author_name, author_avatar, content, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            comment.id, threadId, replyTo, author.id, author.login, author.name, author.avatar, content, comment.createdAt,
        )
        return comment
    }

    heart(id: string, userId: number, hearted: boolean): Pick<PostComment, 'hearts' | 'hearted'> | null {
        const comment = this.find(id)
        if (!comment || comment.removed) return null
        if (hearted) this.ctx.storage.sql.exec('INSERT OR IGNORE INTO hearts (comment_id, user_id) VALUES (?, ?)', id, userId)
        else this.ctx.storage.sql.exec('DELETE FROM hearts WHERE comment_id = ? AND user_id = ?', id, userId)
        const { hearts } = this.ctx.storage.sql.exec<{ hearts: number }>(
            'SELECT COUNT(*) AS hearts FROM hearts WHERE comment_id = ?', id).one()
        return { hearts, hearted }
    }

    /**
     * Removes a comment; pass authorId to only remove it if it's that account's.
     * A top-level comment with replies is blanked so the thread stays together;
     * anything else is deleted, along with a blanked parent left with no replies.
     */
    remove(id: string, authorId?: number): 'removed' | 'missing' | 'forbidden' {
        const comment = this.find(id)
        if (!comment || comment.removed) return 'missing'
        if (authorId !== undefined && comment.author_id !== authorId) return 'forbidden'
        const sql = this.ctx.storage.sql
        sql.exec('DELETE FROM hearts WHERE comment_id = ?', id)
        const hasReplies = sql.exec('SELECT 1 FROM comments WHERE thread_id = ? LIMIT 1', id).toArray().length > 0
        if (hasReplies) {
            sql.exec(`UPDATE comments SET removed = 1, content = '',
                author_id = NULL, author_login = NULL, author_name = NULL, author_avatar = NULL WHERE id = ?`, id)
            return 'removed'
        }
        sql.exec('DELETE FROM comments WHERE id = ?', id)
        if (comment.thread_id) {
            sql.exec(`DELETE FROM comments WHERE id = ? AND removed = 1
                AND NOT EXISTS (SELECT 1 FROM comments WHERE thread_id = ?)`, comment.thread_id, comment.thread_id)
        }
        return 'removed'
    }

    private find(id: string) {
        return this.ctx.storage.sql.exec<{ id: string, thread_id: string | null, author_id: number | null, removed: number }>(
            'SELECT id, thread_id, author_id, removed FROM comments WHERE id = ?', id).toArray()[0]
    }
}
