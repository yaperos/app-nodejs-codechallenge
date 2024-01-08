import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTransactionInput } from '../dto/create-transaction.input';
import { ClientKafka } from '@nestjs/microservices';
import { TasksService } from 'src/modules/tasks/services/tasks.service';
import { TransactionTaskEntity } from '../entities/transaction-task.entity';
import {
  MessageSerializer,
  MicroservicesPatterns,
  TransactionCreationMessageSchema,
} from '@yape/microservices';

@Injectable()
export class TransactionsService {
  private readonly logger: Logger = new Logger(TransactionsService.name);

  constructor(
    @Inject('GATEWAY_PRODUCER')
    private readonly gatewayProducer: ClientKafka,
    private readonly tasksService: TasksService,
  ) {}

  async create(
    createTransactionInput: CreateTransactionInput,
  ): Promise<TransactionTaskEntity> {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    } = createTransactionInput;

    try {
      const task = await this.tasksService.init(3, 10);

      const message =
        MessageSerializer.serialize<TransactionCreationMessageSchema>({
          transactionExternalId: task.id,
          accountExternalIdDebit,
          accountExternalIdCredit,
          tranferTypeId,
          value,
        });

      this.gatewayProducer.emit(
        MicroservicesPatterns.TRANSACTION_CREATION,
        message,
      );

      this.logger.debug(
        `Initiating transaction creation with: accountExternalIdDebit [${accountExternalIdDebit}], accountExternalIdCredit [${accountExternalIdCredit}], value [${value}]`,
      );

      return task;
    } catch (error) {
      this.logger.error(
        `Error trying to start transaction creation with: accountExternalIdDebit [${accountExternalIdDebit}], accountExternalIdCredit [${accountExternalIdCredit}], value [${value}]; Error message: ${error.message};`,
      );

      throw new InternalServerErrorException();
    }
  }

  async findOneTask(id: string): Promise<TransactionTaskEntity> {
    const t = await this.tasksService.findOne(id);
    return t;
  }
}
