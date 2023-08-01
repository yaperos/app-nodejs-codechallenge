export type KafkaPayload = {
  body: any;
  messageId: string;
  messageType: string;
  topicName: string;
  createdTime?: string;
};
