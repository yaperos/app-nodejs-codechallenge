import { createHash } from 'node:crypto';


export function deterministicGuid(seed: string): string {
    const hex = createHash('sha256').update(seed).digest('hex').slice(0, 32).split('');
    hex[12] = '5';
    hex[16] = '89ab'[Number.parseInt(hex[16], 16) % 4];
    const s = hex.join('');
    return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20, 32)}`;
}