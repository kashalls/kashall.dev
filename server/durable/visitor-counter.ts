/// <reference types="@cloudflare/workers-types" />
import { DurableObject } from 'cloudflare:workers'

/**
 * Site-wide visit total. One instance (see useVisitorCounter) serializes every
 * visit, so concurrent visits are never lost. Exported from server/entry.ts.
 *
 * A visitor is a salted hash of their IP and user agent, counted once per UTC
 * day. The salt and the day's hashes are dropped at the next day's first
 * visit, so no visitor can be recognized, or tracked across days, afterwards.
 */
export class VisitorCounter extends DurableObject {
    constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
        super(ctx, env)
        ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS visitors (id TEXT PRIMARY KEY)')
    }

    async visit(ip: string, userAgent: string): Promise<number> {
        const data = new TextEncoder().encode(`${this.salt()}\n${ip}\n${userAgent}`)
        const id = [...new Uint8Array(await crypto.subtle.digest('SHA-256', data))]
            .map(byte => byte.toString(16).padStart(2, '0')).join('')
        // Other visits can run during the digest. If the day rolls over meanwhile,
        // this visitor is counted once more under the new salt, which is harmless.
        const { rowsWritten } = this.ctx.storage.sql.exec('INSERT OR IGNORE INTO visitors (id) VALUES (?)', id)
        return rowsWritten ? this.increment() : this.count()
    }

    count(): number {
        return this.ctx.storage.kv.get<number>('count') ?? 0
    }

    private increment(): number {
        const count = this.count() + 1
        this.ctx.storage.kv.put('count', count)
        return count
    }

    private salt(): string {
        const day = new Date().toISOString().slice(0, 10)
        const current = this.ctx.storage.kv.get<{ day: string, salt: string }>('salt')
        if (current?.day === day) return current.salt
        const salt = crypto.randomUUID()
        this.ctx.storage.sql.exec('DELETE FROM visitors')
        this.ctx.storage.kv.put('salt', { day, salt })
        return salt
    }
}
