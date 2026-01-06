export interface IEventPublisher {
    publishResult(
        transactionId: string,
        status: string,
        reasons: string[],
        matchedRules: string[],
        correlationId: string,
        causationId: string,
    ): Promise<void>;
}

export const EVENT_PUBLISHER = 'EVENT_PUBLISHER';
