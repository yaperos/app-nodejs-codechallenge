import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Topics } from '../../../shared/infrastructure/topics';
import { FinancialTransactionId } from '../../create-financial-transaction/domain/financial-transaction-id';
import { FinancialTransactionStatus } from '../../create-financial-transaction/domain/financial-transaction-status';
import { UpdateFinancialTransactionStatusService } from '../application/update-financial-transaction-status.service';
import { UpdateFinancialTransactionStatusRequestDTO } from './dto/update-financial-transaction-status-request.dto';
import { UpdateFinancialTransactionStatusResponseDTO } from './dto/update-financial-transaction-status-response.dto';

@Controller()
export class UpdateFinancialTransactionStatusController {
  constructor(
    private readonly updateFinancialTransactionStatusService: UpdateFinancialTransactionStatusService,
  ) {}

  @MessagePattern([
    Topics.FinancialTransactionApprovedTopic,
    Topics.FinancialTransactionRejectedTopic,
  ])
  async handle(
    @Payload()
    createFinancialTransactionRequestDTO: UpdateFinancialTransactionStatusRequestDTO,
  ): Promise<UpdateFinancialTransactionStatusResponseDTO> {
    const financialTransactionWasUpdated =
      await this.updateFinancialTransactionStatusService.handle(
        new FinancialTransactionId(
          createFinancialTransactionRequestDTO.accountExternalIdDebit,
        ),
        FinancialTransactionStatus.fromValue(
          createFinancialTransactionRequestDTO.statusTypeId,
        ),
      );

    return new UpdateFinancialTransactionStatusResponseDTO(
      createFinancialTransactionRequestDTO.accountExternalIdDebit,
      financialTransactionWasUpdated,
    );
  }
}
