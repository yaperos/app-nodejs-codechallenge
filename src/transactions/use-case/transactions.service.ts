import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionValidatedRequestDto } from '../adapter/in/event/dto/transaction-validated-request-dto';
import { CreateTransactionDto, TransactionStatus } from '../adapter/in/http/dto/create-transaction-dto';
import { CreateTransactionResponseDto } from '../adapter/in/http/dto/create-transaction-response-dto';
import { GetTransactionResponseDto } from '../adapter/in/http/dto/get-transaction-response-dto';
import { UpdateTransactionResponseDto } from '../adapter/in/http/dto/update-transaction-response-dto';
import { TransactionEntity } from '../adapter/out/data/model/transaction.entity';
import { ValidateTransactionRequestMapper } from '../adapter/out/event/mapper/validate.transaction.request.mapper';
import { TransactionsProducerService } from '../adapter/out/event/transactions.producer.service';
import { CreateTransactionRequestMapper } from './mapper/create.transaction.request.mapper';
import { GetTransactionResponseMapper } from './mapper/get.transaction.response.mapper';

@Injectable()
export class TransactionsService {
  constructor(
      @InjectRepository(TransactionEntity) private transactionsRepository: Repository<TransactionEntity>,
      private readonly transactionsProducerService: TransactionsProducerService,
  ) {}

    async create(createTransactionDto: CreateTransactionDto): Promise<CreateTransactionResponseDto> {
        return CreateTransactionRequestMapper.map(createTransactionDto)
            .then(transactionEntity => {
                this.transactionsRepository.save(transactionEntity)
                    .then(() => {
                        const validateTransactionRequestDto = ValidateTransactionRequestMapper
                            .map(transactionEntity.id, createTransactionDto);
                        return this.transactionsProducerService.validateTransaction(validateTransactionRequestDto)
                    });

                return new CreateTransactionResponseDto(transactionEntity.id);
            });
    }

    async update(transactionValidatedRequestDto: TransactionValidatedRequestDto): Promise<UpdateTransactionResponseDto> {
        return this.transactionsRepository.findOneBy({ id: transactionValidatedRequestDto.traceabilityId })
            .then(transaction => {
                transaction.transactionStatus = transactionValidatedRequestDto.transactionStatus;
                return this.transactionsRepository.save(transaction)
                    .then(() => new UpdateTransactionResponseDto(transaction.id, transaction.transactionStatus));
            });
    }

  findAll(): Promise<TransactionEntity[]> {
    return this.transactionsRepository.find();
  }

  findOne(id: string): Promise<GetTransactionResponseDto> {
      return this.transactionsRepository.findOneBy({ id })
          .then(GetTransactionResponseMapper.map);
  }
}
