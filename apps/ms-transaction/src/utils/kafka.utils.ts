// import { lastValueFrom } from 'rxjs';

// export const publishToQueue = async <T>(
//   message: KafkaMessage<T>,
// ): Promise<void> => {
//   await this.emit(message.topic, {
//     headers: {
//       source: this.context,
//       timestamp: new Date().toISOString(),
//       ...message.headers,
//     },
//     value: message.value,
//   });
// };

// async function emit<T>(topic: string, message: T): Promise<void> {
//   await lastValueFrom(this.kafkaClient.emit(topic, message));
// }
