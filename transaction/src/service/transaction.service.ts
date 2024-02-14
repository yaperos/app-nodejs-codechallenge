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
      this.kafkaService.subscribe(process.env.ANTIFRAUD_TOPIC_PULL, (message: string) => {
        console.log('publish - ',process.env.ANTIFRAUD_TOPIC_PULL,' - ',message);
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

          console.log('transaction.status - ', transaction.status);

          foundTransaction.status = transaction.status;
          this.transactionRepository.save(foundTransaction);
        } else {
          this.logger.log('transaction not founded');
        }
      })
      .catch((error) => {
        this.logger.error('Error al buscar la transacción:', error);
      });
  }

  async evaluarTransaccion( transaccionReq: TransferInput): Promise<Transaction> {
    const transaction: Transaction = TransferRequestMapper.mapToTransaction(transaccionReq);
    const transactionEntity = await this.transactionRepository.save(transaction);

    console.log('publish - ',process.env.ANTIFRAUD_TOPIC_REQ,' - ',transaccionReq);

    this.kafkaService.publish(process.env.ANTIFRAUD_TOPIC_REQ, transactionEntity);
    return transactionEntity;
  }
}