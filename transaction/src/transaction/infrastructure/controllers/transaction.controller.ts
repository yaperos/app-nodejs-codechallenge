import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from 'src/transaction/application/services';
import { CreateTransactionEvent } from 'src/transaction/domain/events/create-transaction.event';
import {
  CreateTransactionDto,
  EnumStatus,
} from 'src/transaction/domain/models';
import {
  APPROVED_TRANSACTION,
  CREATE_TRANSACTION,
  REJECTED_TRANSACTION,
  TRANSACTION_CREATED,
} from 'src/transaction/domain/ports';

@Controller()
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject('SECURITY_CLIENT') private readonly securityClient: ClientKafka,
  ) {}
  onModuleInit() {
    this.securityClient.subscribeToResponseOf(TRANSACTION_CREATED);

    this.securityClient.connect();
  }
  onModuleDestroy() {
    this.securityClient.close();
  }

  @MessagePattern(CREATE_TRANSACTION)
  async create(
    @Payload() createTransactionDto: Required<CreateTransactionDto>,
  ) {
    console.log(createTransactionDto);
    const transaction = await this.transactionService.create(
      createTransactionDto,
    );
    this.securityClient.emit(
      TRANSACTION_CREATED,
      new CreateTransactionEvent({
        ...createTransactionDto,
        id: transaction.transactionExternalId,
      }),
    );
    return JSON.stringify(transaction);
  }
  @MessagePattern(APPROVED_TRANSACTION)
  async transactionApproved(@Payload() { id }: any) {
    return await this.transactionService.update(id, {
      transactionStatus: { name: EnumStatus.approved },
    });
  }
  @MessagePattern(REJECTED_TRANSACTION)
  async transactionRejected(@Payload() { id }: any) {
    return await this.transactionService.update(id, {
      transactionStatus: { name: EnumStatus.rejected },
    });
  }
}
