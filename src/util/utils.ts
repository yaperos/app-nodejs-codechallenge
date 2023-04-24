
import { TransactionStatusEnum, TransactionTypeEnum } from '@commons/emun';
import { Injectable } from '@nestjs/common';

import { Transactions } from 'transaction/model/entity/transactions.entity';
import { TransactionData } from 'transaction/model/request/transaction-request';
import { TransactionResponseData } from 'transaction/model/response/transaction-data.response';
import { TransactionResponse } from 'transaction/model/response/transaction.response';
import { TransactionStatus } from 'transaction/model/transaction-status';
import { TransactionType } from 'transaction/model/transaction-type';

@Injectable()
export class Utils {
  builderCreateTransaction(request: TransactionData): Transactions{
    const dateTime = new Date();
    return {
      transactionId: request['transactionExternalId'] ? request['transactionExternalId'] : undefined,
      accountExternalIdCredit: request.accountExternalIdCredit,
      accountExternalIdDebit: request.accountExternalIdDebit,
      transactionStatus: request['transactionStatus'] ? this.selectStatusUpdate(request['transactionStatus']?.name) : 1,
      transferTypeId: typeof(request['transactionType']) === 'number' ? request.transactionType : this.selectTypeTransactionUpdate(request['transactionType']?.['name']), 
      valueTransaction: request['valueTransaction'] ? request['valueTransaction'] : request.value,
      createdAt: request['createdAt'] ? request['createdAt'] : dateTime,
    };
  }

  buildResponseData(response: Transactions): TransactionResponseData {
    return {
      transactionExternalId: response.transactionId,
      accountExternalIdCredit: response.accountExternalIdCredit,
      accountExternalIdDebit: response.accountExternalIdDebit,
      transactionType: this.selectTypeTransaction(response.transferTypeId),
      transactionStatus: this.selectStatus(response.transactionStatus),
      valueTransaction: response.valueTransaction,
      createdAt: response.createdAt
    };
  }

  buildResponseFind(response: Transactions): TransactionResponse {
    return {
      transactionExternalId: response.transactionId,
      transactionType: this.selectTypeTransaction(response.transferTypeId),
      transactionStatus: this.selectStatus(response.transactionStatus),
      valueTransaction: response.valueTransaction,
      createdAt: response.createdAt,
    }
  }

  private selectStatusUpdate(status: TransactionStatusEnum) {
    var data: number;
    switch (status) {
      case TransactionStatusEnum.pending:
        data = 1;
        break;
      case TransactionStatusEnum.approved:
        data = 2;
        break;
      case TransactionStatusEnum.rejected:
        data = 3;
        break;
    }
    return data;
  }

  private selectTypeTransactionUpdate(typeUpdate: TransactionTypeEnum) {
    var data: number;
    switch (typeUpdate) {
      case TransactionTypeEnum.charge:
        data = 1;
        break;
      case TransactionTypeEnum.pay:
        data = 2;
        break;
    }
    return data;
  }

  private selectStatus(status: number): TransactionStatus {
    var data: TransactionStatus;
    switch (status) {
      case 1:
        data = { name: TransactionStatusEnum.pending };
        break;
      case 2:
        data = { name: TransactionStatusEnum.approved };
        break;
      case 3:
        data = { name: TransactionStatusEnum.rejected };
        break;
    }
    return data;
  }

  private selectTypeTransaction(typeTrans: number): TransactionType {
    var data: TransactionType;
    switch (typeTrans) {
      case 1:
        data = { name: TransactionTypeEnum.charge };
        break;
      case 2:
        data = { name: TransactionTypeEnum.pay };
        break;
    }
    return data;
  }
}
