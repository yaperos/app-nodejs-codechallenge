import { Injectable } from '@nestjs/common';
import { TransactionService } from 'src/adapter/output/db/transaction.service';
import { Transaction } from '../models/transaction.interface';
import { AntifraudAnalysisResponsePayload } from "./antifraud_analysis_response.payload";
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
    //>>>>>>>>>>>>>>>>>>>>
    const topic = 'antifraud-analysis-response';
    const payload: AntifraudAnalysisResponsePayload = {
      transactionId: tx.id,
      version: tx.version,
      approved: true,
    };
    //this.antifraudProducerService.send(topic, payload);

    await this.kafkaService.getProducer().connect();

    //console.log(
    //'FraudAnalysisUsecase kafkaService: ' + JSON.stringify(this.kafkaService),
    //);
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
}
