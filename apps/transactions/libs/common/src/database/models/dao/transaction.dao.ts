import { Injectable } from '@nestjs/common';
import { TransactionsEntity } from '../entities/transactions.entity';
import { StatusTransaction } from '@app/common/utils/enum/status.enum';
import { DataTransactionCreateDTO } from 'src/transactions/transactions.dto';

@Injectable()
export class TransactionDAO {
  dataCreateTransaction(data: DataTransactionCreateDTO): TransactionsEntity {
    const transaction = new TransactionsEntity();
    transaction.status = StatusTransaction.PENDING;
    transaction.type = data.tranferTypeId;
    transaction.accountExternalIdCredit = data.accountExternalIdCredit;
    transaction.accountExternalIdDebit = data.accountExternalIdDebit;
    transaction.value = data.value;
    return transaction;
  }
}
