export class MessageBrokerDto<T> {
  idTransaction: string;
  type: string;
  date: Date;
  data: T;
}