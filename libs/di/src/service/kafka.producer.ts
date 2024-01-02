import { Kafka, Producer, logLevel } from "kafkajs";

export class KafkaProducerService {

  private kafka: Kafka;
  private producer: Producer;

  constructor(
    private readonly clientId: string,
    private readonly brokers: Array<string>,
    private readonly topic: string
  ) {
    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: this.brokers,
      logLevel: logLevel.ERROR
    });
    this.producer = this.kafka.producer();
  }

  async sendMessage(key: string, message: string) {
    await this.producer.connect();
    await this.producer.send({
      topic: this.topic,
      messages: [{ key, value: message }]
    })
    await this.producer.disconnect();
  }

  async createTopic(): Promise<boolean> {
    let created = false;
    const admin = this.kafka.admin();
    await admin.connect();
    const topics = await admin.listTopics();

    if (!topics.includes(this.topic)) {
      created = await admin.createTopics({
        validateOnly: true,
        waitForLeaders: true,
        timeout: 120,
        topics: [{ topic: this.topic }],
      });
    }
    await admin.disconnect();
    return created;
  }

}