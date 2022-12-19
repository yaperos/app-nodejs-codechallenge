import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { TransactionService } from '../../adapter/output/db/transaction.service';
import { AntifraudAnalysisResponsePayload } from '../models/events/antifraud_analysis_response.payload';

@Injectable()
export class UpdateTransactionAfterValidationUsecase {
  constructor(private transactionService: TransactionService) {}

  update(antifrauAnalysisResponse: AntifraudAnalysisResponsePayload) {
    Logger.log(
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
         * If not update (updateResult.affected == 0)
         * you could:
         * * Notify by email about failed transaction
         * * Queue rejected transaction id for post processing
         */
        Logger.log(
          'UpdateTransactionAfterValidationUsecase: updated record result ' +
            JSON.stringify(updateResult),
        );
      });
  }
}
