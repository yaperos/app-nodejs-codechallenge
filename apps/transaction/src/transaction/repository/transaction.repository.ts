import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TransactionMapper } from '../mapper/transaction.mapper';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/request/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/request/update-transaction.dto';
import { TransactionCreatedDto } from '../dto/response/transaction-created.dto';
import { TransactionUpdatedDto } from '../dto/response/transaction-updated.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GENERIC_ERROR_MESSAGE } from '../../constants/constants';

@Injectable()
export class TransactionRepository {

    private readonly logger = new Logger('TransactionRepository');

    constructor(
        private readonly transactionMapper: TransactionMapper,
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>
    ) {}

    async create(createTransactionDto: CreateTransactionDto): Promise<TransactionCreatedDto> {

        try {
            const transaction = 
                this.transactionRepository.create(this.transactionMapper.fromCreateTransactionDto(createTransactionDto));

            await this.transactionRepository.save(transaction);

            return this.transactionMapper.toTransactionCreatedDto(transaction);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(GENERIC_ERROR_MESSAGE);
        }
        
    }

    async update(updateTransactionDto: UpdateTransactionDto): Promise<TransactionUpdatedDto> {

        try {
            
            const transaction = 
                await this.transactionRepository.preload(this.transactionMapper.fromUpdateTransactionDto(updateTransactionDto));

            await this.transactionRepository.update(transaction.transactionExternalId,transaction);

            return this.transactionMapper.toTransactionCreatedDto(transaction);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(GENERIC_ERROR_MESSAGE);
        }
    }

    async findById(id: string) {
        try {
            const transaction = await this.transactionRepository.findOneBy({
                transactionExternalId: id
            });

            if(!transaction) {
                throw new NotFoundException(`Transaction with id ${id} not found`);
            }

            return this.transactionMapper.toTransactionFindedDto(transaction);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(GENERIC_ERROR_MESSAGE);
        }
    }
}
