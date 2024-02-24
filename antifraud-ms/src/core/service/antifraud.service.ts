import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { Constant } from 'src/common/constant/constant';
import { TransactionCreateDto } from 'src/common/dto/transactionCreateDto.dto';
import { TransactionUpdateDto } from 'src/common/dto/transactionUpdateDto.dto ';
import { TransactionStatusEnum } from 'src/common/enum/transactionStatus.enum';

@Injectable()
export class AntifraudService implements OnModuleInit {
  private readonly logger = new Logger(AntifraudService.name);
  private topicTxUpdate: string;
  private maxAmount: number

  constructor(
    @Inject('TRANSACTION-BCP')
    protected readonly clientTransaction: ClientKafka,
    private readonly configService: ConfigService,
  ) {
    this.topicTxUpdate = this.configService.getOrThrow<string>(Constant.TOPIC_TRANSACTION_UPDATE);
    this.maxAmount =  parseInt(this.configService.getOrThrow<string>(Constant.TRANSACTION_MAX_VALUE)); 
  }

  async onModuleInit() {
    this.clientTransaction.subscribeToResponseOf(this.topicTxUpdate);
    await this.clientTransaction.connect();
  }

  async review( transactionDto: TransactionCreateDto): Promise<void> {
    this.logger.log("review traceId:" + transactionDto.traceId); 
    try {
        let updateDto = new TransactionUpdateDto(transactionDto.traceId, transactionDto.code, TransactionStatusEnum.APPROVED);
        if (transactionDto.value > this.maxAmount) {
            updateDto = new TransactionUpdateDto(transactionDto.traceId, transactionDto.code, TransactionStatusEnum.REJECTED);
        }    
        this.clientTransaction.emit(this.topicTxUpdate,  JSON.stringify(updateDto))
    } catch(ex) {
      this.logger.error("ocurred an error, traceId:" + transactionDto.traceId, ex );
      throw ex;
    }
 }
}
