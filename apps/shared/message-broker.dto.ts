export class MessageBrokerDto<T> {
  type: string;
  date: Date;
  content: T;
}