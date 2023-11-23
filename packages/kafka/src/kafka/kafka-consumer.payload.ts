export class KafkaPayload {
    public id: string;
    public body: any;
    public eventType: string;
    public topicName: string;
    public createdAt?: string;
    public timestamp?: number;
  
    create(id: string, body: any, eventType: string, topicName: string, timestamp: number): KafkaPayload {
      return {
        id,
        body,
        eventType,
        topicName,
        createdAt: new Date().toISOString(),
        timestamp
      } as KafkaPayload;
    }
  }
  