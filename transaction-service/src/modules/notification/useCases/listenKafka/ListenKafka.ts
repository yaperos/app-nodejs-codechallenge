import { UseCase } from 'clean-common-lib';
import { IKafkaService } from 'common-microservice-lib';
import { TransactionExternalResponseEvent } from '../../domain';

interface Request {
  topic: string;
}

export class ListenKafka implements UseCase<Request, Promise<void>> {
  private kafkaService: IKafkaService;

  constructor(kafkaService: IKafkaService) {
    this.kafkaService = kafkaService;
  }

  async execute(request: Request): Promise<void> {
    await this.kafkaService.subcribeMessageFromTopic(request.topic, (value) => {
      new TransactionExternalResponseEvent(value);
    });
  }
}
