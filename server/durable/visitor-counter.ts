/// <reference types="@cloudflare/workers-types" />
import { DurableObject } from 'cloudflare:workers'

/**
 * Site-wide visit total. One instance (see useVisitorCounter) serializes every
 * increment, so concurrent visits are never lost. Exported from server/entry.ts.
 */
export class VisitorCounter extends DurableObject {
    increment(): number {
        const count = this.count() + 1
        this.ctx.storage.kv.put('count', count)
        return count
    }

    count(): number {
        return this.ctx.storage.kv.get<number>('count') ?? 0
    }
}
