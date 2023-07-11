import { Controller} from '@nestjs/common';
import {TransactionsService} from './transactions.service';
import { KafkaService } from '../kafka/kafka';

@Controller('transactions')
export class TransactionsController {

  public constructor(
    private transactionService: TransactionsService,
    private readonly events: KafkaService,
  ) {}

  public async evaluate(data: any): Promise<void> {
    return this.transactionService.evaluate(data);
  }

  public async onModuleInit() {
    this.events.subscribe(
      'transaction_created',
      this.evaluate.bind(this)
    );
    await this.events.init();
  }
}
