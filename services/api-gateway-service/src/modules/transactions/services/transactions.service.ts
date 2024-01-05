import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTransactionInput } from '../dto/create-transaction.input';
import { ClientKafka } from '@nestjs/microservices';
import { RequestedNewTransactionMessage } from '../messages/requested-new-transaction.message';
import { TaskStatus } from 'src/common/constants/task-status.enum';

@Injectable()
export class TransactionsService {
  private readonly logger: Logger = new Logger(TransactionsService.name);

  constructor(
    @Inject('GATEWAY_PRODUCER')
    private readonly gatewayProducer: ClientKafka,
  ) {}

  create(createTransactionInput: CreateTransactionInput) {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    } = createTransactionInput;

    try {
      const message = new RequestedNewTransactionMessage(
        accountExternalIdDebit,
        accountExternalIdCredit,
        tranferTypeId,
        value,
      );

      this.gatewayProducer.emit('create_transaction', message);

      this.logger.debug(
        `Starting transaction creation with: accountExternalIdDebit [${accountExternalIdDebit}], accountExternalIdCredit [${accountExternalIdCredit}], value [${value}]`,
      );

      return { status: TaskStatus.PENDING };
    } catch (error) {
      this.logger.error(
        `Error trying to start transaction creation with: accountExternalIdDebit [${accountExternalIdDebit}], accountExternalIdCredit [${accountExternalIdCredit}], value [${value}]; Error message: ${error.message};`,
      );

      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }
}
