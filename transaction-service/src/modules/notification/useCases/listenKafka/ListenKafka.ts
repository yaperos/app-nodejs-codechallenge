import { DomainEvents, UseCase } from 'clean-common-lib';
import { IKafkaService } from 'common-microservice-lib';
import { KafkaNotification } from '../../domain/kafkaNotification';

interface Request {
  topic: string;
}

export class ListenKafka implements UseCase<Request, Promise<void>> {
  private kafkaService: IKafkaService;

  constructor(kafkaService: IKafkaService) {
    this.kafkaService = kafkaService;
  }

  async execute(): Promise<void> {
    await this.kafkaService.subcribeMessageFromTopic(
      'transaction-external',
      (value) => {
        const kafkaNotificationOrError = KafkaNotification.create(value);

        if (kafkaNotificationOrError.isSuccess) {
          DomainEvents.dispatchEventsForAggregate(
            kafkaNotificationOrError.getValue().id
          );
        } else {
          console.log(kafkaNotificationOrError.getErrorValue());
        }
      }
    );
  }
}
