import { STATUS_TRANSACTION } from 'src/constants/transaction-status.enum';
import { TransactionDto } from 'src/dto/transaction.dto';
import { Transaction } from 'src/entity/transaction.entity';
import { NameAttribute } from 'src/dto/transaction.dto';
import { TYPE_TRANSACTION } from 'src/constants/transaction-type.enum';

export class ControllerSupport {
  static getTransactionResponse(transaction: Transaction) {
    const transactionDto: TransactionDto = new TransactionDto();
    transactionDto.createdAt = transaction.createdAt.toISOString();
    transactionDto.transactionExternalId = transaction.transactionExternalId;
    transactionDto.transactionStatus = new NameAttribute(
      STATUS_TRANSACTION[transaction.transactionStatus],
    );
    transactionDto.transactionType = new NameAttribute(
      TYPE_TRANSACTION[transaction.transactionType],
    );
    transactionDto.value = transaction.value;
    return transactionDto;
  }

  static getListTransactionResponse(
    listTransaction: Transaction[],
  ): TransactionDto[] {
    return listTransaction.map((transaction) =>
      this.getTransactionResponse(transaction),
    );
  }
}
