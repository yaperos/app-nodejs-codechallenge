import { NotificationTopic } from "../../../../../helpers/domain/enums/notification-topic.enum";

export interface INotificationRepository {
    sendMessage(topic: NotificationTopic, message: any): Promise<void>;
}