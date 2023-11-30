import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { consumer, producer } from '../config/kafka.config';
import { ICreateTransactionResponse, IRetriveTransactionResponse } from './interfaces/transaction-response.interface';

@Injectable()
export class TransactionService {

  constructor(
    @InjectRepository(Transaction) private readonly userRepository: Repository<Transaction>,
  ) { }

  async subscribeValidatedTransaction(): Promise<void> {
    await consumer.connect();
    await consumer.subscribe({ topic: 'validated-transaction' });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const transaccionData = JSON.parse(message.value.toString());
        console.log("se recibe topico desde servicio antifraud para actualizar status", transaccionData);
        const validation = await this.updateStatusTransaction(transaccionData);
        console.log(validation);

      },
    });
  }

  /**
   * this is function is used to create Transaction in Transaction Entity.
   * @param transactionDto this will type of transactionDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of transaction
   */
  async createTransaction(transactionDto: CreateTransactionDto): Promise<ICreateTransactionResponse> {
    const transaction: Transaction = new Transaction();
    transaction.accountExternalIdDebit = transactionDto.accountExternalIdDebit;
    transaction.accountExternalIdCredit = transactionDto.accountExternalIdCredit;
    transaction.transferTypeId = transactionDto.transferTypeId;
    transaction.transactionValue = transactionDto.value;
    transaction.transactionStatusId = 1;
    const res = await this.userRepository.save(transaction);

    await producer.connect();

    // Enviar evento a Kafka para notificar la creación de la transacción
    await producer.send({
      topic: 'validating-transaction',
      messages: [{ value: JSON.stringify(transaction) }],
    });
    await producer.disconnect();

    return { transactionExternalId: transaction.id, createdAt: transaction.createdAt.toString() };
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of string, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  private async updateStatusTransaction(updateUserDto: UpdateTransactionDto) {
    const { id, transactionStatusId } = updateUserDto;
    return await this.userRepository.update({ id }, { transactionStatusId })
  }

  async findTransactions(): Promise<IRetriveTransactionResponse[]> {
    const transactions = await this.userRepository.find({ relations: ['transferType', 'transactionStatus'] });
    return transactions.map(trans => ({
      transactionExternalId: trans.id,
      transactionType: { name: trans.transferType.transferTypeName },
      transactionStatus: { name: trans.transactionStatus.transactionStatusName },
      value: trans.transactionValue,
      createdAt: trans.createdAt.toString()
    }));
  }

  async findTransactionById(idTransaction: string): Promise<IRetriveTransactionResponse> {
    const { id, transferType, transactionStatus, transactionValue, createdAt } = await this.userRepository.findOne({
      where: { id: idTransaction },
      relations: ['transferType', 'transactionStatus']
    });
    return {
      transactionExternalId: id,
      transactionType: { name: transferType.transferTypeName },
      transactionStatus: { name: transactionStatus.transactionStatusName },
      value: transactionValue,
      createdAt: createdAt.toString()
    }
  }

}
