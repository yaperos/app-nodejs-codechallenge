import { Injectable } from '@nestjs/common';
import { TransactionEntity } from '../entity/transaction.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { RequestTransaction } from '../dto/request-transaction.args';
import { TransactionStatusEntity } from '../entity/transaction-status.entity';
import { TransactionTypeEntity } from '../entity/transaction-type.entity';

@Injectable()
export class TransactionService {

    constructor(
        @InjectRepository(TransactionEntity)
        private transactionRepository: Repository<TransactionEntity>,
        @InjectRepository(TransactionStatusEntity)
        private transactionStatusRepository: Repository<TransactionStatusEntity>,
        @InjectRepository(TransactionTypeEntity)
        private transactionTypeRepository: Repository<TransactionTypeEntity>
    ) { }

    findAll(): Promise<TransactionEntity[]> {
        return this.transactionRepository.find();
    }

    async updated(transactionExternalId: string, transactionStatusId: number): Promise<UpdateResult> {
        const status = await this.transactionStatusRepository.findOne({ where: { id: transactionStatusId } });
        return this.transactionRepository.update(transactionExternalId, { transactionStatus: status });
    }

    findById(transactionExternalId: string): Promise<TransactionEntity> {
        return this.transactionRepository.findOne({
            where: { transactionExternalId },
            relations: {
                transactionStatus: true,
                transactionType: true
            }
        });
    }

    async save(transac: RequestTransaction): Promise<TransactionEntity> {
        const status = await this.transactionStatusRepository.findOne({ where: { id: 1 } });
        const transfer = await this.transactionTypeRepository.findOne({ where: { id: transac.tranferTypeId } });
        const trans = this.transactionRepository.create({ ...transac, transactionStatus: status, transactionType: transfer });
        return this.transactionRepository.save(trans);
    }
}
