import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
import { Constantes } from 'src/common/constantes';
import { Repository } from 'typeorm';
import { AntiFraudEvent } from './dto/antifraud.event';
import { TransactionRequest } from './dto/transaction-request.dto';
import { TransactionResponse } from './dto/transaction-response.dto';
import { TransactionEvent } from './dto/transaction.event';
import { Transaction } from './entity/transaction.entity';

@Injectable()
export class TransactionService implements OnModuleInit {

    private readonly logger = new Logger(TransactionService.name);

    constructor(
        @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
        @Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientKafka
    ) { }

    onModuleInit() {
        this.transactionClient.subscribeToResponseOf('transaction.message.event');
    }

    /**
     * Init process transaction
     * @param TransactionRequest 
     * @returns 
     */
    async initProcessTransaction({ accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value }: TransactionRequest) {
        //Save transaction with pending status
        this.logger.log("Save transaction with pending status");
        var transaction = await this.savePendingStatus(accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value);
        //Send Transaction Created Event
        this.logger.log(transaction);
        this.logger.log("Send Transaction Created Event");
        return this.transactionClient.send(
            'transaction.message.event',
            new TransactionEvent(transaction.transactionExternalId, value).toString()
        ).pipe(
            map(async (response: AntiFraudEvent) => {
                // Back message event / update transaction status
                this.logger.log("message event response");
                this.logger.log(response);
                await this.updateTransactionStatus(response.transactionExternalId, response.transactionStatus, Constantes.by_antifraud);
                // Resource to retrieve a transaction
                return new TransactionResponse(await this.findOneById(response.transactionExternalId));
            })
        );
    }

    /**
     * function that save transaction ins pending status
     * @param accountExternalIdDebit 
     * @param accountExternalIdCredit 
     * @param tranferTypeId 
     * @param value 
     * @returns 
     */
    async savePendingStatus(accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value): Promise<Transaction> {
        var transaction: Transaction = {};
        transaction.accountExternalIdDebit = accountExternalIdDebit;
        transaction.accountExternalIdCredit = accountExternalIdCredit;
        transaction.transactionTypeId = tranferTypeId;
        transaction.transactionStatusId = Constantes.status_pending;
        transaction.value = value;
        transaction.createdBy = Constantes.by_default;
        transaction.createdAt = new Date();
        transaction.active = Constantes.status_active;
        return await this.transactionRepository.save(transaction);
    }

    /**
     * update transaction Status Approved / Rejected event
     * @param idTransaction 
     * @param statusTransaction 
     * @param updateByEvent 
     */
    async updateTransactionStatus(idTransaction, statusTransaction, updateByEvent) {
        return await this.transactionRepository.createQueryBuilder()
            .update(Transaction)
            .set({ transactionStatusId: statusTransaction, updatedBy: updateByEvent, updatedAt: new Date() })
            .where("id = :id", { id: idTransaction })
            .execute();
    }

    /**
     * find one by id
     * @param id 
     * @returns 
     */
    async findOneById(id): Promise<Transaction> {
        return await this.transactionRepository.findOne({
            where: { transactionExternalId: id },
            relations: ['transactionType', 'transactionStatus']
        });
    }
}
