export interface ConsumedMessage {
    topic: string;
    key: string | null;
    value: string;
    headers: Record<string, string>;
}

export interface SubscribeOptions {
    groupId: string;
    topic: string;
    handler: (message: ConsumedMessage) => Promise<void>;
}

export abstract class MessageConsumerPort {
    abstract subscribe(options: SubscribeOptions): Promise<void>;
}