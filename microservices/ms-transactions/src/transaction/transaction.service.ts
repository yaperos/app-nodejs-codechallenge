import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum, TransactionDto } from 'src/models/transaction.dto';
import { Repository } from 'typeorm';
import { TransactionEntity } from 'src/models/transaction.entity';
import { KafkaService } from '../services/kafka.service';

@Injectable()
export class TransactionService {
  logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private kafkaService: KafkaService,
  ) {}
  public async getAll() {
    this.logger.debug('Find all transactions from repository');
    return await this.transactionRepository.find();
  }
  public async getOne(id: string) {
    return await this.transactionRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  public async save(transaction: TransactionDto) {
    this.logger.debug('Saving transaction ' + JSON.stringify(transaction));
    try {
      transaction.status = StatusEnum.PENDING; // Always 'pending' on create transaction.
      const entity = await this.transactionRepository.save(transaction);
      this.kafkaService.sendMessage(JSON.stringify(entity));
      return entity;
    } catch (err) {
      this.logger.debug('Error saving transaction ' + err);
    }
  }
  public async updateStatus(id: string, status: string): Promise<any> {
    this.logger.debug('Updating status transaction id ' + id);
    try {
      const entity = await this.transactionRepository.update(id, {
        status: status,
      });
      return entity;
    } catch (err) {
      this.logger.debug('Error updating transaction ' + err);
    }
  }
}
