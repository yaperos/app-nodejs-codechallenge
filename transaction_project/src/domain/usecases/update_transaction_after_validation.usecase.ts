import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { TransactionService } from '../../adapter/out/db/transaction.service';
import { AntifraudAnalysisResponsePayload } from 'src/adapter/input/messaging/antifraud_analysis_response.payload';

@Injectable()
export class UpdateTransactionAfterValidationUsecase {
  constructor(private transactionService: TransactionService) {}
  async update(antifrauAnalysisResponse: AntifraudAnalysisResponsePayload) {
    console.log(
      'UpdateTransactionAfterValidationUsecase: received ' +
        JSON.stringify(antifrauAnalysisResponse),
    );

    const updated: UpdateResult = await this.transactionService.update(
      antifrauAnalysisResponse,
    );

    console.log(
      'UpdateTransactionAfterValidationUsecase: updated record ' +
        JSON.stringify(updated),
    );
  }
}
