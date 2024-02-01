import { Transaction } from 'src/entities/transaction.entity';
import { Injectable, Logger } from '@nestjs/common';
import { TransferInput } from 'src/dtos/transaction-request.input';
import { InjectRepository } from '@nestjs/typeorm';
import { KafkaService } from 'src/service-core/kafka.service';
import { Repository } from 'typeorm';
import { TransferRequestMapper } from 'src/mappers/transaction-request.mapper';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private kafkaService: KafkaService,
  ) {
    this.startConsuming();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async startConsuming() {
    try {
      this.kafkaService.subscribe('antifraud-pull', (message: string) => {
        this.resolveTransaction(JSON.parse(message));
      });
    } catch (error) {
      this.logger.error('Error al suscribirse a Kafka:', error);
    }
  }

  resolveTransaction(transaction: Transaction): void {
    this.transactionRepository
      .findOne({ where: { id: transaction.id } })
      .then((foundTransaction) => {
        if (foundTransaction) {
          this.logger.log('Transacción encontrada:', foundTransaction);
          foundTransaction.status = transaction.status;
          this.transactionRepository.save(foundTransaction);
        } else {
          this.logger.log('Transacción no encontrada');
        }
      })
      .catch((error) => {
        this.logger.error('Error al buscar la transacción:', error);
      });
  }

  async evaluarTransaccion( transaccionReq: TransferInput): Promise<Transaction> {
    const transaction: Transaction =
      TransferRequestMapper.mapToTransaction(transaccionReq);
    const transactionEntity = await this.transactionRepository.save(transaction);
    this.kafkaService.publish('antifraud-request', transactionEntity);
    return transactionEntity;
  }
}
