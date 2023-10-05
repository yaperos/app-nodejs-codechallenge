import { Inject, Injectable } from '@nestjs/common';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';


@Injectable()
export class TransactionsService {

  constructor(@Inject('KAFKA_PRODUCER') private kafkaProducer: Producer) {}

  createTransaction(createServiceDto: CreateTransactionDto) {
    const key = Math.floor(Math.random() * 100);
    this.sendKafkaEvent(this.generateKey(), {
      eventType: 'TransactionCreated',
      ...createServiceDto,
    });
    return 'This action adds a new service';
  }

  private sendKafkaEvent(key, value) {
    this.kafkaProducer.send({
      topic: 'transactionsyape',
      messages: [{ key, value: JSON.stringify(value) }],
    });
  }

  private generateKey() {
    return Math.floor(Math.random() * 1000).toString();
  }

  /*
   The basis of the following operations is provided for possible future implementations
  */

  findAll() {
    return `This action returns all services`;
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateServiceDto: UpdateTransactionDto) {
    updateServiceDto.id = id;
    this.sendKafkaEvent(`${id}`, {
      eventType: 'TransactionUpdated',
      ...updateServiceDto,
    });
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    this.sendKafkaEvent(`${id}`, { eventType: 'ServiceDeleted', id });
    return `This action removes a #${id} service`;
  }

}