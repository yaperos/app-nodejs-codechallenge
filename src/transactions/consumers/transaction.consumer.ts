import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from '../services/transactions.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class TransactionConsumer {
  private readonly logger = new Logger(TransactionConsumer.name);

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly configService: ConfigService,
  ) {}

  @EventPattern('transaction.status.updated')
  async handleTransactionStatusUpdated(@Payload() message: any) {
    try {
      this.logger.log(
        `Recibiendo actualización de estado: ${JSON.stringify(message)}`,
      );

      const { transactionExternalId, status, rejectionReason } = message;

      await this.transactionsService.updateStatus(
        transactionExternalId,
        status,
        rejectionReason,
      );

      this.logger.log(
        `Estado actualizado para transacción ${transactionExternalId}: ${status}`,
      );
    } catch (error) {
      this.logger.error(
        `Error procesando actualización de estado: ${error.message}`,
      );
    }
  }
}