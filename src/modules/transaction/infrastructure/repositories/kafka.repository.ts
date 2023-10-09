import KafkaAdapter from "../../../../adapters/infrastructure/kafka/kafka.adapter";
import { NotificationTopic } from "../../../../helpers/domain/enums/notification-topic.enum";
import { INotificationRepository } from "../../domain/interfaces/repositories/notification.repository.interface";

export class KafkaRepository implements INotificationRepository {

    constructor() {}
    
    public async sendMessage(topic: NotificationTopic, value: any): Promise<void> {
        const kafkaAdapter = KafkaAdapter.getInstance(process.env.TRANSANCTION_APP_KAFKA_GROUP ?? "test-group-01");
        const message = [
            {
                key: 'key1', 
                value: JSON.stringify(value)
            }
        ]
        kafkaAdapter.produce(topic, message);
    }

}