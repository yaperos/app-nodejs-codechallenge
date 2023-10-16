import { Controller, ValidationPipe } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { AntifraudRequestDto } from './dto/antifraud.dto';
import { Logger } from '@logger/logger.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { VALIDATE_TRANSACTION_AMOUNT } from 'constants/kafka-topics';

@Controller('antifraud')
export class AntifraudController {
  constructor(
    private readonly logger: Logger,
    private readonly antifraudService: AntifraudService,
  ) {}

  @EventPattern(VALIDATE_TRANSACTION_AMOUNT)
  async handleTransactionAmountValidation(
    @Payload(ValidationPipe) antifraudDto: AntifraudRequestDto,
  ) {
    try {
      const { value, transactionId } = antifraudDto;
      this.logger.log(
        `Starting transaction validation for ID ${transactionId}`,
      );
      await this.antifraudService.validateTransaction(transactionId, value);
      this.logger.log('Transaction validated successfully');
    } catch (e) {
      this.logger.error(
        'Error in handleTransactionAmountValidation',
        e.message,
      );
      throw new Error(e);
    }
  }
}
