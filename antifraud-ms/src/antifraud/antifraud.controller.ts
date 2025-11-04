import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntifraudService } from './antifraud.service';
import { ValidateTransactionDto } from './dto/validateTransaction.dto';

@Controller()
export class AntifraudController {
  private readonly logger = new Logger(AntifraudController.name);
  constructor(private readonly antifraudService: AntifraudService) {}

  @MessagePattern('validate_transaction')
  async create(
    @Payload() transactionPayload: { transaction: ValidateTransactionDto },
  ) {
    this.logger.log(
      `Validating transaction ${JSON.stringify(transactionPayload, null, 2)}`,
    );

    const { transaction } = transactionPayload;
    return this.antifraudService.validateTransaction(transaction);
  }
}
