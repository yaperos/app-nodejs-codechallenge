import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka';

@Injectable()
export class TransactionsService {

  public constructor(
    private readonly events: KafkaService,
  ) {}

  public async evaluate(data: any): Promise<void> {
    await this.events.emit('transaction_approved', {
      key: (new Date).getTime().toString(),
      value: JSON.stringify({...data,
        process: 'ok'})
    });
  }
}
