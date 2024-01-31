import { Injectable, NotFoundException , Logger } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { KafkaProducerService } from 'src/kafka/producer.service';
import { KafkaConsumerService } from 'src/kafka/consumer.service';
import { statusAntifraud } from './dto/status-antifraud';

@Injectable()
export class TransactionService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly kafkaConsumerService: KafkaConsumerService,
  ) {
    this.kafkaConsumerService.subscribeToTopic('topicofantrifraud', this.handleAntiFraudResultEvent.bind(this));
  }

  async create(createTransactionInput: CreateTransactionInput): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create(createTransactionInput);
    const createdTransaction = await this.transactionRepository.save(newTransaction);
    await this.kafkaProducerService.produce('transaction-emitter', createdTransaction.transactionExternalId, createdTransaction);
    console.log('Transacción creada:', createdTransaction);
    return createdTransaction;
  } 

  async handleAntiFraudResultEvent(message: statusAntifraud): Promise<void> {
    try {
      console.log('Evento recibido del tópico topicofantrifraud:', message);
  
      if (message && message.id && message.status) {
        await this.update(message);
      } else {
        console.error('Error: Mensaje incompleto o inválido.');
        throw new Error('Error: Mensaje incompleto o inválido.');
      }
    } catch (error) {
      console.error('Error al procesar el evento del tópico topicofantrifraud:', error);
      throw new Error('Error al procesar el evento del tópico topicofantrifraud');
    }
  }
  
async findById(id: string): Promise<Transaction> {
  const transaction = await this.transactionRepository.findOne({ where: { transactionExternalId: id } });
  if (!transaction) {
    throw new NotFoundException(`Transaction with ID ${id} not found`);
  }
  return transaction;
}

  findAll() {
    return `This action returns all transaction`;
  }

  async update(message: statusAntifraud): Promise<Transaction> {
    try {
      const { id, status } = message;
      var transaction = await this.findById(id);
      transaction.transactionStatus = status;
      var updatedTransaction = await this.transactionRepository.save(transaction);
      console.log('Transmition Update:', transaction);
      return updatedTransaction;
    } catch (error) {
      throw new Error('Error al actualizar la transacción');
    }
  }
  
}
