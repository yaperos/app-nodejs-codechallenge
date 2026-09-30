import type { Logger } from '@nestjs/common';
import { BrokenCircuitError, type IPolicy } from 'cockatiel';

export async function failOpen<T>(params: {
    policy: IPolicy;
    logger: Logger;
    operation: string;
    fn: () => Promise<T>;
    fallback: T;
}): Promise<T> {
    try {
        return await params.policy.execute(params.fn);
    } catch (error) {
        if (!(error instanceof BrokenCircuitError)) {
            params.logger.warn(`${params.operation} failed, using fallback: ${(error as Error).message}`);
        }
        return params.fallback;
    }
}