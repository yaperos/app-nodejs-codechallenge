import { EventNames } from '../../shared/imports'
import { KafkaMessageManagerInstance } from '../messages/instances/kafkaMessageManager.instance'
import { type MessageManager } from '../messages/messageManager'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class MessageManagerFactory {
  public static getKafkaManagerInstance (): MessageManager {
    const { TRANSACTION_KAFKA_GROUP_ID, TRANSACTION_UPDATED_KAFKA_TOPIC, TRANSACTION_CREATED_KAFKA_TOPIC } = process.env
    const groupId = TRANSACTION_KAFKA_GROUP_ID ?? ''
    const topic = TRANSACTION_UPDATED_KAFKA_TOPIC ?? ''
    const producerTopic = TRANSACTION_CREATED_KAFKA_TOPIC ?? ''
    return new KafkaMessageManagerInstance(groupId, topic, producerTopic, [EventNames.TRANSACTION_APPROVED, EventNames.TRANSACTION_REJECTED])
  }
}
