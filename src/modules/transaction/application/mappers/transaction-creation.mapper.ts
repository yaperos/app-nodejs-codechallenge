import { Transaction } from "../../domain/entities/transaction.entity";
import { TransferType } from "../../domain/entities/transfer-type.entity";
import { CreateTransactionRequestDto } from "../../domain/interfaces/dtos/transaction-request.dto";
import { ITransactionCreationMapper } from "../../domain/interfaces/mappers/transaction-creation.mapper.interface";

export class TransactionCreationMapper implements ITransactionCreationMapper {
    public transform(data: CreateTransactionRequestDto, transferType: TransferType): Transaction {
        const transaction = new Transaction();
        transaction.setAccountExternalIdDebit(data.accountExternalIdDebit);
        transaction.setAccountExternalIdCredit(data.accountExternalIdCredit);
        transaction.setTransferType(transferType);
        transaction.setValue(data.value);

        return transaction;
    }
}