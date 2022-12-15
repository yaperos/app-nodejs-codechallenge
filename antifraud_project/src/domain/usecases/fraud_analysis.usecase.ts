import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionService } from 'src/adapter/output/db/transaction.service';
import { Transaction } from '../models/transaction.interface';
import { AntifraudAnalysisResponsePayload } from './antifraud_analysis_response.payload';
import { KafkaService } from 'src/adapter/input/messaging/kafka.service';
import { TransactionStatus } from '../models/transaction_status.enum';

@Injectable()
export class FraudAnalysisUsecase {
  constructor(
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
    private readonly kafkaService: KafkaService,
  ) {}

  async analyze(transactionId: number) {
    // get tx with version

    // TODO: analysis

    console.log(
      'FraudAnalysisUsecase analyze() transactionId: ' + transactionId,
    );

    const tx: Transaction = await this.transactionService.findById(
      transactionId,
    );
    console.log('FraudAnalysisUsecase analyze:: record: ' + JSON.stringify(tx));

    const newStatus = this.getStatus(tx);

    const topic = 'antifraud-analysis-response';
    const payload: AntifraudAnalysisResponsePayload = {
      transactionId: tx.id,
      version: tx.version,
      newStatus,
    };

    await this.kafkaService.getProducer().connect();

    console.log(
      'FraudAnalysisUsecase: send antifraud analysis to Transaction: ' +
        JSON.stringify(payload),
    );

    await this.kafkaService.send(
      this.kafkaService.getProducer(),
      topic,
      payload,
    );
  }

  getStatus(transaction: Transaction): TransactionStatus {
    const maxAmount = this.configService.get<number>(
      'application.business.transaction.max-amount',
    );
    const result =
      transaction.value > maxAmount
        ? TransactionStatus.rejected
        : TransactionStatus.approved;

    console.log('FraudAnalysisUsecase newStatus: ' + result);
    return result;
  }
}
