import { PublishEvent } from '../../../../../Contexts/Transaction/events/application/PublishEvent';
import { BaseUseCase } from '../../../../Shared/application/BaseUseCase';
import { ApplicationError } from '../../../../Shared/domain/ApplicationError';
import { WrongGuid } from '../../domain/errors/WrongGuid';
import { Transaction } from '../../domain/Transaction';
import { TransactionRepository } from '../../domain/TransactionRepository';
import { UpdateTransaction } from '../update/UpdateTransaction';

interface Request {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
}

export class CreateTransaction extends BaseUseCase<Request, Promise<any> | ApplicationError> {
  constructor(private readonly repository: TransactionRepository,
    private readonly publishEvent: PublishEvent) {
    super();
  }
  public async run(data: Request): Promise<any> {
    const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!pattern.test(data.accountExternalIdCredit)) throw new WrongGuid()
    if (!pattern.test(data.accountExternalIdDebit)) throw new WrongGuid()
    const transaction = Transaction.create(data.tranferTypeId, data.value, data.accountExternalIdDebit, data.accountExternalIdCredit);
    await this.repository.create(transaction);
    await this.publishEvent.run({ topic: 'TRANSACTION_CREATED', data: transaction })
    return {
      data: {
        transactionExternalId: transaction.getId(),
        transactionType: { name: data.tranferTypeId === 1 ? 'Debit' : 'Credit' },
        transactionStatus: { name: transaction.getStatus() },
        value: transaction.getValue(),
        createdAt: transaction.getCreated()
      }
    }
  }
}
