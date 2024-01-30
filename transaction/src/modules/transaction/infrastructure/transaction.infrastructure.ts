import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../domain/repositories/transaction.repository';
import { Transaction } from '../domain/transaction';
import { Repository } from 'typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionDto } from './dtos/transaction.dto';
import { TransactionDoc } from './entities/transaction-doc.entity';
import { ProducerRecord } from 'kafkajs';
import { AppService } from '../../../app.service';
//import { KafkaService } from 'src/modules/kafka/kafka.service';

@Injectable()
export class TransactionInfrastructure implements TransactionRepository {
    constructor(
        @Inject('TRANSACTION_REPOSITORY')
        private readonly repository: Repository<TransactionEntity>,
        @Inject("TRANSACTION_DOC_REPOSITORY") private readonly repository_doc: Repository<TransactionDoc>,
        /*private readonly service: KafkaService */
    ) { }

    async save(transaction: Transaction): Promise<Transaction> {
        try {
            const entity = TransactionDto.fromDomainToData(transaction)
            const transactionInserted = await this.repository.save(entity)
            return TransactionDto.fromDataToDomain(transactionInserted)
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getById(transactionId: string): Promise<Transaction> {
        try {
            const entity = await this.repository.findOne({ where: { transactionId } })
            if (!entity) throw new NotFoundException()

            return TransactionDto.fromDataToDomain(entity)
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async save_doc(transaction: TransactionDoc) {
        await this.repository_doc.save(transaction)
    }

    async getByIdDoc(transactionId: string): Promise<any> {
        try {
            const entity = await this.repository_doc.findOne({ where: { transactionId } })
            if (!entity) throw new NotFoundException()

            return entity
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async sentMessage(record: ProducerRecord): Promise<void> {
        try {
            //await this.service.produce(record)
        } catch (error) {

        }
    }
}