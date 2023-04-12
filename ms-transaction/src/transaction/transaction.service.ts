import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { Repository } from 'typeorm';
import { NewTransactionDTO } from './DTO/NewTransactionDTO';
import { ValidationRequestDTO } from './DTO/ValidationRequestDTO';
import { Transaction } from './entities/transaction.entity';
import { TransactionStatus } from './entities/transactionStatus.entity';
import { TransactionType } from './entities/transactionType.entity';
import { StatesTransactionType } from './helper/StatesTransaction';

import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction) private transactionsRepo: Repository<Transaction>,
        @InjectRepository(TransactionType) private transactionTypeRepo: Repository<TransactionType>,
        @InjectRepository(TransactionStatus) private transactionStatusRepo: Repository<TransactionStatus>,
        @Inject('MS_ANTI_FRAUD')
        private readonly _kafka: ClientKafka,
    ) {
        (async () => {
            // Agregamos los tipos de transaccion
            await transactionTypeRepo.upsert(
                [
                    { transactionTypeId: 1, name: "TYPE_1" },
                    { transactionTypeId: 2, name: "TYPE_2" },
                ],
                ["transactionTypeId"],
            );

            // Agregamos los tipos de estado
            await transactionStatusRepo.upsert(
                [
                    { transactionStatusId: 1, name: "PENDING" },
                    { transactionStatusId: 2, name: "APPROVED" },
                    { transactionStatusId: 3, name: "REJECTED" },
                ],
                ["transactionStatusId"],
            );
        })();
    }

    async getT(transactionExternalId: string): Promise<Transaction> {
        return this.transactionsRepo.findOneOrFail({
            where: {
                transactionExternalId: transactionExternalId,
            },
            relations: ["transactionType", "transactionStatus"],
        });
    }

    async create(nT: NewTransactionDTO): Promise<Transaction>  {
        const transaction = this.transactionsRepo.create({
            accountExternalIdDebit: nT.accountExternalIdDebit,
            accountExternalIdCredit: nT.accountExternalIdCredit,
            tranferTypeId: nT.tranferTypeId,
            value: nT.value,
            createdAt: new Date(),
        });

        return this.transactionsRepo
            .save(transaction)
            .then((result) => {
                return this.getT(result.transactionExternalId);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    async valid(transaction: Transaction) {
        Logger.log(`SENDING VALIDATION [ID: ${transaction.transactionExternalId}]`);

        const requestObj = {
            transactionExternalId: transaction.transactionExternalId,
            value: transaction.value,
        } as ValidationRequestDTO;

        this._kafka.emit(
            "transaction.created",
             JSON.stringify(requestObj),
        );
    }

    async updateTransactionStatus(
        transactionId: string,
        status: StatesTransactionType,
    ): Promise<Transaction> {
        let transactionObj = await this.getT(transactionId);
        if (transactionObj === undefined) return Promise.reject("This transaction was not found");
        
        transactionObj.transactionStatus.transactionStatusId = status;
        
        let transactionUpdated = await this.transactionsRepo.save(transactionObj);

        const statusValue = await this.transactionStatusRepo.findOne({
            where: { transactionStatusId: transactionUpdated.transactionStatusId },
        });
        transactionUpdated.transactionStatus.name = statusValue.name;
        return transactionUpdated;
    }
}
