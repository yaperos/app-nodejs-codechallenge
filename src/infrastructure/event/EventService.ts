import {
  Consumer,
  EachMessageHandler,
  EachMessagePayload,
  Kafka,
  Producer,
  ProducerRecord,
} from "kafkajs";
import { IEventService, dependencies } from "./EventService.interface";

type consumerDependencies = Pick<
  dependencies,
  "transactionAntiFraudResponseHandler"
>;

export class KafkaEventService implements IEventService {
  private readonly _kafka: Kafka;
  private _consumer: Consumer;
  private _producer: Producer;

  constructor() {
    this._kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
    });
  }

  async setupEvents({ transactionAntiFraudResponseHandler }: dependencies) {
    await this._setupProducer();
    await this._setupConsumer({ transactionAntiFraudResponseHandler });
  }

  private async _setupProducer() {
    this._producer = this._kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    });

    await this._producer.connect();
  }

  public async sendEvent(record: ProducerRecord) {
    console.info("sendEvent record:", record);
    const metadata = await this._producer.send({ ...record });
    console.info("sendEvent metadata:", JSON.stringify(metadata));
  }

  private async _setupConsumer(consumerDependencies: consumerDependencies) {
    this._consumer = this._kafka.consumer({
      groupId: process.env.KAFKA_CONSUMER_GROUP ?? "yape-challenge-group",
    });

    await this._consumer.connect();
    await this._consumer.subscribe({
      topics: ["transaction_anti_fraud_topic"],
      fromBeginning: true,
    });

    await this._consumer.run({
      eachMessage: this._consumerMessagesHandler(consumerDependencies),
    });
  }

  private _consumerMessagesHandler({
    transactionAntiFraudResponseHandler,
  }: consumerDependencies): EachMessageHandler {
    return async ({ topic, message }: EachMessagePayload): Promise<void> => {
      switch (topic) {
        case "transaction_anti_fraud_topic":
          return await transactionAntiFraudResponseHandler.processAntiFraudResponse(
            message
          );
        default:
          console.info(`Unhandled topic: ${topic}`);
          return;
      }
    };
  }
}
