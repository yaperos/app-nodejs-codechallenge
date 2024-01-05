import { CreateAntiFraudDto, LoggerService } from '@app/shared';
import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { ValidateTransactionService } from './validate-transaction.service';

@Controller()
export class ValidateTransactionController implements OnModuleInit {
  constructor(
    private readonly antiFraudService: ValidateTransactionService,
    private readonly logger: LoggerService,
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientKafka,
  ) {}

  @EventPattern('transactionValidation')
  async transactionValidation(
    @Payload() createAntiFraudDto: CreateAntiFraudDto,
  ) {
    const { transactionExternalId } = createAntiFraudDto;
    this.logger.info(
      `${ValidateTransactionController.name}.transactionValidation.entry`,
      createAntiFraudDto,
      transactionExternalId,
    );

    const response =
      await this.antiFraudService.validationValue(createAntiFraudDto);

    this.logger.info(
      `${ValidateTransactionController.name}.transactionValidation.validationValue`,
      response,
      transactionExternalId,
    );

    this.transactionClient
      .send('updateTransaction', JSON.stringify(response))
      .subscribe({
        next: (value) => {
          console.log(typeof value);
          this.logger.info(
            `${ValidateTransactionController.name}.updateTransaction.response`,
            value,
            transactionExternalId,
          );
        },
        error: (err) =>
          this.logger.error(
            `${ValidateTransactionController.name}.updateTransaction.error`,
            err,
            transactionExternalId,
          ),
      });
  }

  onModuleInit() {
    this.transactionClient.subscribeToResponseOf('updateTransaction');
  }
}
