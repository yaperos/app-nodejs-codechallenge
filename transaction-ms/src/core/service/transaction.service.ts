import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Constant } from 'src/common/constant/constant';
import { TransactionCreateRequest } from 'src/common/dto/request/transactionCreateRequest.dto';
import { TransactionResponse } from 'src/common/dto/response/transactionResponse.dto';
import { TransactionDto } from 'src/common/dto/transactionDto.dto';
import { TransactionUpdateDto } from 'src/common/dto/transactionUpdateDto.dto ';
import { TransactionMapper } from 'src/common/mapper/transactionMapper';
import { Transaction } from 'src/domain/entity/transaction.entity';
import { HttpDomainException } from 'src/domain/exception/http.exception';
import { transactionNotFoundError } from 'src/domain/exception/transaction.error';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService implements OnModuleInit {

  private topicAntiFraud: string;
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @Inject('ANTIFRAUD-BCP') protected readonly clientAntiFraud: ClientKafka,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Transaction)  private transactionRepository: Repository<Transaction>,
    private readonly configService: ConfigService

  ) {
    this.topicAntiFraud = this.configService.getOrThrow<string>(Constant.TOPIC_ANTIFRAUD_REVIEW);
  }

  async onModuleInit() {
    this.clientAntiFraud.subscribeToResponseOf(this.topicAntiFraud);
    await this.clientAntiFraud.connect();
  }

  async createTransaction(traceId: string, transactionRequest: TransactionCreateRequest): Promise<void> {
    this.logger.log("createTransaction traceId:"+traceId);
    try {
      const transaction = await this.transactionRepository.save(
        TransactionMapper.convertToTransaction(transactionRequest)
        );
      const transactionDto = TransactionMapper.convertToTransactionDto(traceId, transaction);
      this.cacheManager.set(transactionDto.code, transactionDto, 30000);
      this.clientAntiFraud.emit(this.topicAntiFraud,  JSON.stringify(transactionDto))
    } catch (e) {
      this.logger.error('ocurred an error: traceId:' + traceId, e );
      throw e;
    }
  }

  async updateStatusTransaction(transactionUpdateDto: TransactionUpdateDto): Promise<void> {
    this.logger.log("createTransaction traceId:"+transactionUpdateDto.traceId);
    try{
      let transactionDto = await this.findTransaction(transactionUpdateDto.traceId, transactionUpdateDto.code);
      await this.transactionRepository.save(
          { id: transactionDto.id, 
            status: transactionUpdateDto.status, 
            updatedAt: new Date()
          }
        );
        this.cacheManager.del(transactionDto.code);
      } catch (e) {
        this.logger.error('ocurred an error: traceId:'+ transactionUpdateDto.traceId, e );
        throw e;
      }
  }

  async findTransactionResponse(traceId: string, code: string): Promise<TransactionResponse>{
    this.logger.log("findTransactionResponse traceId:" + traceId + ', code:' + code);
    const transaction = await this.findOne(code);

    return TransactionMapper.convertToTransactionResponse(transaction);
  }   
  
  private async findTransaction(traceId: string,  code: string): Promise<TransactionDto> {
    let transactionDto = await (
                               this.cacheManager.get(code)
                              ) as TransactionDto
    if(!transactionDto) {
        const transaction = await this.findOne(code);
        return TransactionMapper.convertToTransactionDto(traceId, transaction)
    }

    return transactionDto;
  }

  private async findOne( code: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({ where: { code }});
    if (transaction == null) {
      throw new HttpDomainException(
        transactionNotFoundError.status,
        transactionNotFoundError.code,
        transactionNotFoundError.message
      );
    }

    return transaction;
  }

}
