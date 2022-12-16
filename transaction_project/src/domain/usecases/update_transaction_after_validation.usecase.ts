import { Injectable } from '@nestjs/common';
import { TransactionService } from '../../adapter/output/db/transaction.service';
import { AntifraudAnalysisResponsePayload } from 'src/adapter/input/messaging/antifraud_analysis_response.payload';
import { map } from 'rxjs';

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
      .pipe(
        map((updateResult) => {
          console.log(
            'UpdateTransactionAfterValidationUsecase: updated record ' +
              JSON.stringify(updateResult),
          );
        }),
      );
  }
}
