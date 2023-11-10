import { Message } from 'kafkajs';

export interface IProducerService {
    produce(topic: string, message: Message): Promise<void>;
}