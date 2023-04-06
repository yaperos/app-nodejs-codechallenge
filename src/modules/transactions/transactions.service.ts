import { Inject, Injectable, NotFoundException, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Query, QueryOptions } from 'mongoose';
import { Transaction, TransactionDocument } from './transaction.schema';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { KafkaConsumerService } from '../kafka/kafka-consumer.service';
import { EVENTS, TRANSACTION_CONSUMER } from 'src/app.constants';
import { plainToClass } from 'class-transformer';
import { TransactionDto } from './dtos/transaction.dto';
import { TransactionStatuses } from './types/transaction-types-enums';

@Injectable()
export class TransactionsService implements OnModuleInit {
    constructor(
        @InjectModel(Transaction.name) private readonly transactionModel: Model<TransactionDocument>,
        private readonly producer: KafkaProducerService,
        private readonly consumer: KafkaConsumerService) {
    }

    async onModuleInit() {
        await this.producer.connect();
        await this.consumer.connect(TRANSACTION_CONSUMER);

        this.consumer.subscribe(EVENTS.ON_TRANSACTION_VALIDATED, async partialTransaction => {
            console.log('Step 4');
            console.log('Transaccion verificada, actualizando valor');
            const { _id, ...partialData } = JSON.parse(partialTransaction);
            const newTransaction = await this.update(_id, partialData);
            // AQUI SE PUEDEN AÑADIR EVENTOS PARA AUDITAR
            console.log('Transaccion');
            console.log(`Estado resultante: ${newTransaction.transactionStatus}`)
            console.log(newTransaction);
        });
    }

    /**
     * 
     * @param createDto Transacción Atómica
     * @returns 
     */
    async create(createDto: CreateTransactionDto) {
        console.log('Step 1::: Transaction creation attempt');
        const session = await this.transactionModel.startSession()
        session.startTransaction();

        try {
            const transaction = new this.transactionModel(createDto);
            await transaction.save({ session })
            await session.commitTransaction();

            const parsedTransaction = plainToClass(TransactionDto, transaction.toJSON());
            // Envio de data para el consumer de anti fraude
            this.producer.send(EVENTS.ON_TRANSACTION_CREATED, JSON.stringify(parsedTransaction));
            return parsedTransaction;

        } catch (ex: any) {
            await session.abortTransaction();
            throw new HttpException(ex, HttpStatus.UNPROCESSABLE_ENTITY, { cause: new Error('Transaction aborted') });
        } finally {

            session.endSession()
        }
    }

    async findAll(
        query: FilterQuery<Transaction> = {},
        options: QueryOptions<Transaction> = {}
    ) {
        const transactions = await this.transactionModel.find(query, null, options).exec();
        return transactions.map(transactin => plainToClass(TransactionDto, transactin.toJSON()));
    }

    async findById(id: string) {
        const transaction = await this.transactionModel.findById(id).exec();
        if (!transaction) {
            throw new NotFoundException(`Entity with id ${id} not found`);
        }
        return plainToClass(TransactionDto, transaction.toJSON());
    }

    async findOne(query: FilterQuery<Transaction> = {}) {
        const transaction = await this.transactionModel.findOne(query).exec();
        if (!transaction) {
            throw new NotFoundException(`Not found`);
        }
        return plainToClass(TransactionDto, transaction.toJSON());
    }


    async update(id: string, updateDto: UpdateTransactionDto) {

        const transaction = await this.transactionModel.findByIdAndUpdate(id, updateDto, { returnOriginal: false }).exec();
        if (!transaction) {
            throw new NotFoundException(`Entity with id ${id} not found`);
        }
        return transaction;
    }

    async delete(id: string) {
        const transaction = await this.transactionModel.findById(id).exec();
        if (!transaction) {
            throw new NotFoundException(`Entity with id ${id} not found`);
        }

        const deleted = await this.transactionModel.deleteOne({ _id: transaction._id }).exec();
        if (!deleted.acknowledged) {
            return null;
        }

        return plainToClass(TransactionDto, transaction.toJSON());
    }
}