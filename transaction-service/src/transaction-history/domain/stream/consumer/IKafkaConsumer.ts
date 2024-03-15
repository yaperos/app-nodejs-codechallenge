export abstract class IKafkaConsumer {
  abstract startConsumer(): Promise<void>;
}
