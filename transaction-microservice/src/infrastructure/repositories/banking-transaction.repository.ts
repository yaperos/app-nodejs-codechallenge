import { Injectable, NotFoundException } from "@nestjs/common";

import { BankingTransactionRepository } from "../../domain/repositories/banking-transactionRepository.interface";
import { CreateBankingTransactionInput } from "src/domain/models/inputs/create-banking-transaction";
import { InjectRepository } from "@nestjs/typeorm";
import { BankingTransaction } from "../entities/banking-transaction.entity";
import { Repository } from "typeorm";
import { TransferType } from "../entities/transfer-type.entity";
import { v4 as uuidv4 } from 'uuid';
import { UpdateBankingTransactionInput } from "src/domain/models/inputs/update-banking-transaction";

@Injectable()
export class DatabaseBankingTransactionRepository implements BankingTransactionRepository {


    constructor(
        @InjectRepository(BankingTransaction)
        private readonly bankingTransactionEntityRepository: Repository<BankingTransaction>,
        @InjectRepository(TransferType)
        private readonly transferTypeEntityRepository: Repository<TransferType>,
    ) { }

    async save(transaction: CreateBankingTransactionInput): Promise<BankingTransaction> {
        const transferType = await this.transferTypeEntityRepository.findOneBy({ id: transaction.transferTypeId });
        if (!transferType) throw new NotFoundException(`TransferType with id: ${transaction.transferTypeId} not found`);

        const entity = this.toBankingTransactionEntity(transaction);
        entity.createdAt = new Date();
        entity.transactionStatus = { name: 'pending' };
        entity.transferType = transferType;
        entity.transactionExternalId = uuidv4();

        //const newbankingTransaction = this.bankingTransactionEntityRepository.create(entity);

        return await this.bankingTransactionEntityRepository.save(entity)
    }


    async update(updateTransaction: UpdateBankingTransactionInput): Promise<BankingTransaction> {

        const transaction = await this.bankingTransactionEntityRepository
        .findOne({
            where:{transactionExternalId: updateTransaction.transactionExternalId},
            relations: ['transferType']
        });
        
        if (!transaction) throw new NotFoundException(`Transaction with transactionExternalId: ${updateTransaction.transactionExternalId} not found`);

        transaction.transactionStatus = {'name': updateTransaction.transactionStatus};

        return await this.bankingTransactionEntityRepository.save(transaction);
    }


    private toBankingTransactionModel(entity: BankingTransaction): CreateBankingTransactionInput {
        const temp: CreateBankingTransactionInput = new CreateBankingTransactionInput();

        temp.accountExternalIdCredit = entity.accountExternalIdCredit;
        temp.accountExternalIdDebit = entity.accountExternalIdDebit;
        temp.transferTypeId = entity.transferType.id;
        temp.value = entity.value;

        console.log(temp)

        return temp;
    }

    private toBankingTransactionEntity(model: CreateBankingTransactionInput): BankingTransaction {
        const temp: BankingTransaction = new BankingTransaction();

        temp.accountExternalIdCredit = model.accountExternalIdCredit;
        temp.accountExternalIdDebit = model.accountExternalIdDebit;
        temp.value = model.value;

        return temp;
    }
}