import { UseCase } from 'clean-common-lib';
import { IKafkaService } from 'common-microservice-lib';

interface Request {
  topic: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

export class NotifyKafka implements UseCase<Request, Promise<void>> {
  private kafkaService: IKafkaService;

  constructor(kafkaService: IKafkaService) {
    this.kafkaService = kafkaService;
  }

  async execute(request: Request): Promise<void> {
    await this.kafkaService.sendMessageToTopic(request);
  }
}
