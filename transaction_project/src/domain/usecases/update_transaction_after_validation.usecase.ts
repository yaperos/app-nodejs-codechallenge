import { Injectable } from '@nestjs/common';
import { TransactionService } from '../../adapter/output/db/transaction.service';
import { AntifraudAnalysisResponsePayload } from 'src/adapter/input/messaging/antifraud_analysis_response.payload';

@Injectable()
export class UpdateTransactionAfterValidationUsecase {
  constructor(private transactionService: TransactionService) {}

  update(antifrauAnalysisResponse: AntifraudAnalysisResponsePayload) {
    console.log(
      'UpdateTransactionAfterValidationUsecase: received ' +
        JSON.stringify(antifrauAnalysisResponse),
    );

    return this.transactionService
      .update(
        antifrauAnalysisResponse.transactionId,
        antifrauAnalysisResponse.version,
        antifrauAnalysisResponse.newStatus,
      )
      .subscribe((updateResult) => {
        /**
         * It is not part of the requirements.
         * 
         * If updateResult.affected == 0 (no update was done),
         * You could:
         * * Notify by email about failed transaction
         * * Queue rejected transaction id for post processing
         */
        console.log(
          'UpdateTransactionAfterValidationUsecase: updated record result ' +
            JSON.stringify(updateResult),
        );
      });
  }
}
