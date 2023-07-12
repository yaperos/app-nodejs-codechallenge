import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka';

@Injectable()
export class TransactionsService {

  public constructor(
    private readonly events: KafkaService,
  ) {}

  public async evaluate(data: any): Promise<void> {
    const topic = data.value > 1000 ? 'transaction_rejected' : 'transaction_approved';

    await this.events.emit(topic, {
      transactionExternalId: data.transactionExternalId,
    });
  }
}
