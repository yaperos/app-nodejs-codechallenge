export abstract class IKafkaProducer {
  abstract sendMessage(data: any): Promise<void>;
}
