import { Admin, Kafka, KafkaConfig } from "kafkajs";
import { ConfigEnv } from "../config";

class KafkaConnection {
  private client!: Admin;
  private isConnected = false;
  private static instance: KafkaConnection;
  public kafka!: Kafka;

  constructor(
    config: KafkaConfig,
    public topic: string,
    public numPartitions: number,
    public replicationFactor: number
  ) {
    this.kafka = new Kafka(config);
    KafkaConnection.instance = this;
    this.topic = topic;
    this.numPartitions = numPartitions;
    this.replicationFactor = replicationFactor;
    return KafkaConnection.instance;
  }

  /**
   * Returns the instance of the KafkaConnection class.
   * @param {string} topic - The topic to be used.
   * @param {number} numPartitions - The number of partitions to be used.
   * @param {number} replicationFactor - The replication factor to be used.
   * @returns
   */
  static getInstance(
    topic: string,
    numPartitions: number = 3,
    replicationFactor: number = 1
  ): KafkaConnection {
    const kafkaConfig = {
      clientId: ConfigEnv.kafka.clientId,
      brokers: ConfigEnv.kafka.brokers,
    };

    return new KafkaConnection(
      kafkaConfig,
      topic,
      numPartitions,
      replicationFactor
    );
  }

  private setupEventHandlers() {
    const { CONNECT, DISCONNECT } = this.client.events;

    this.client?.on(CONNECT, () => {
      this.isConnected = true;
    });

    this.client?.on(DISCONNECT, () => {
      this.isConnected = false;
    });
  }

  /**
   * Creates the topic if it doesn't exist.
   * @returns {Promise<void>}
   */
  async ensureTopicExists(): Promise<void> {
    try {
      this.connect();
      const existsTopics = await this.client.listTopics();
      if (existsTopics.includes(this.topic)) return;
      await this.client.createTopics({
        topics: [
          {
            topic: this.topic,
            numPartitions: this.numPartitions,
            replicationFactor: this.replicationFactor,
          },
        ],
        waitForLeaders: true,
      });
      console.log(`[KafkaConnection] Topic ${this.topic} created`);
    } catch (error) {
      console.error(
        `[KafkaConnection] Error al crear el tópico ${this.topic}:`,
        error
      );
      throw error;
    } finally {
      this.disconnect();
    }
  }

  private async connect() {
    if (!this.client || !this.isConnected) {
      this.client = this.kafka.admin();
      this.setupEventHandlers();
      await this.client.connect();
      this.isConnected = true;
    }
  }

  private async disconnect() {
    if (this.client || this.isConnected) {
      await this.client.disconnect();
    }
  }
}

export { KafkaConnection };
