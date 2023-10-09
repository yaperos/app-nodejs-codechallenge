import { Transaction } from "../../domain/entities/transaction.entity";
import { ITransactionInfoMapper } from "../../domain/interfaces/mappers/transaction-info.mapper.interface";
import { ITransactionInfo } from "../../domain/interfaces/transaction-info.interface";

export class TransactionInfoMapper implements ITransactionInfoMapper {
    public transform(data: Transaction): ITransactionInfo {
        const transactionInfo: ITransactionInfo = {
            transactionExternalId: data.getId() as number,
            transactionType: {
                name: data.getTransferType().getName()
            },
            transactionStatus: {
                name: data.getStatus() as string
            },
            value: data.getValue(),
            createdAt: data.getCreatedAt() as Date
        }

        return transactionInfo;
    }    
}