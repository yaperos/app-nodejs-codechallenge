export interface EventMessagePort {
    sendMessage(topic: string, payload: string);
}