export class MessageBrokerDto<T> {
    id: string;
    type: string;
    occurredOn: Date;
    attributes: T;
    meta?: any;
}
