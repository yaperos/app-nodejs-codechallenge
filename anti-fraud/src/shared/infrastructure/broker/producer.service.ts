import { BrokerEventsName } from './broker.enum';

export interface ProducerService {
  emit<T extends object>(topic: BrokerEventsName, message: T): Promise<boolean>;
}
