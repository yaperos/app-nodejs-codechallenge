import { Injectable } from '@nestjs/common';
import { AntifraudAnalysisResponsePayload } from 'src/adapter/input/messaging/antifraud_analysis_response.payload';

@Injectable()
export class UpdateTransactionAfterValidationUsecase {
  async update(antifrauAnalysisResponse: AntifraudAnalysisResponsePayload) {
    console.log(
      'UpdateTransactionAfterValidationUsecase: received ' +
        JSON.stringify(antifrauAnalysisResponse),
    );
  }
}