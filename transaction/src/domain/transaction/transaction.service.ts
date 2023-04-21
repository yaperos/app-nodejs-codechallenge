import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ClientKafka } from '@nestjs/microservices';
import { GetTransactionDto } from './dto/get-transaction.dto';
import { TRANSACTION_STATUS } from './constants/transaction-status.enum';
import { TRANSACTION_TYPE } from './constants/transaction-type.enum';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        @Inject('ANTI_FRAUD_SERVICE')
        private readonly antiFraudClient: ClientKafka,
    ) { }

    async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        const trans = this.transactionRepository.create(createTransactionDto);
        return this.transactionRepository.save(trans);
    }

    validate(transaction: Transaction) {
        return this.antiFraudClient.send('transaction_created', transaction.value);
    }

    async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
        const trans = await this.transactionRepository.findOne({ where: { id } });
        if (trans) {
            return await this.transactionRepository.save({ ...trans, ...updateTransactionDto });
        }
    }

    findOne(getTransactionDto: GetTransactionDto): Promise<Transaction> {
        return this.transactionRepository.findOneOrFail({
            where: {
                id: getTransactionDto.transactionExternalId,
                ...(getTransactionDto?.transactionType?.name && { tranferTypeId: TRANSACTION_TYPE[getTransactionDto?.transactionType?.name.toLocaleUpperCase()] }),
                ...(getTransactionDto?.value && { value: getTransactionDto?.value }),
                ...(getTransactionDto?.transactionStatus?.name && { tranferStatusId: TRANSACTION_STATUS[getTransactionDto?.transactionStatus?.name.toLocaleUpperCase()] }),
            },
        });
    }
}
