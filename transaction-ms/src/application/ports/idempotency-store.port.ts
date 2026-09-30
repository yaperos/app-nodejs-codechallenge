export type IdempotencyRecord =
    | { status: "in_progress", fingerprint: string }
    | { status: "completed", fingerprint: string; response: unknown }

export abstract class IdempotencyStorePort {
    abstract acquire(key: string, fingerprint: string, ttlSeconds: number): Promise<IdempotencyRecord | null>
    abstract complete(key: string, fingerprint: string, response: unknown, ttlSecond: number): Promise<void>;
    abstract release(key: string): Promise<void>;
}