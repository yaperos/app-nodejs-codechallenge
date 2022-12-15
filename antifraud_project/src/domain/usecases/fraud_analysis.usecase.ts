import { Injectable } from '@nestjs/common';
import { TransactionService } from 'src/adapter/output/db/transaction.service';
import { Transaction } from '../models/transaction.interface';
import { KafkaService } from 'src/adapter/input/messaging/kafka.service';

@Injectable()
export class FraudAnalysisUsecase {
  constructor(
    private transactionService: TransactionService,
    private readonly kafkaService: KafkaService,
  ) {}

  async analyze(id: number) {
    // get tx with version

    // TODO: analysis

    console.log('FraudAnalysisUsecase analyze() id: ' + id);

    const tx: Transaction = await this.transactionService.findById(id);
    console.log('FraudAnalysisUsecase analyze:: record: ' + JSON.stringify(tx));

  
  }
}