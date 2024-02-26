import { Injectable } from "@nestjs/common";
import { TransactionEvent } from "./entities/transaction-event.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { ProducerService } from "src/kafka/producer.service";
import { CreateTransactionInput } from "./dto/create-transaction.input";
import { v4 as uuidv4 } from "uuid";
import { UpdateTransactionInput } from "./dto/update-transaction.input";
import { TransactionType } from "./entities/transaction-type.entity";
import { TransactionStatus } from "./entities/transaction-status.entity";
import {
  TransactionStatus as EnumTransactionStatus,
  TransactionType as EnumTransactionType,
} from "@my-org/common-tools";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
    private readonly producerService: ProducerService
  ) {}

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async findById(id: string): Promise<Transaction> {
    return this.transactionRepository.findOneBy({ transactionExternalId: id });
  }

  async createTransaction(createTransactionInput: CreateTransactionInput) {
    const newTransaction = this.transactionRepository.create({
      transactionStatus: {
        id: EnumTransactionStatus.Pending,
        name: EnumTransactionStatus[EnumTransactionStatus.Pending],
      },
      transactionType: {
        id: Number(createTransactionInput.transactionTypeId),
        name: EnumTransactionType[createTransactionInput.transactionTypeId],
      },
      createdAt: new Date(),
      ...createTransactionInput,
    });

    const createdTransaction: Transaction =
      await this.transactionRepository.save(newTransaction);

    //Define a created transaction event
    const createdTransactionEvent: TransactionEvent = {
      id: uuidv4(),
      transactionExternalId: createdTransaction.transactionExternalId,
      transactionStatusId: createdTransaction.transactionStatus.id,
      transactionTypeId: createdTransaction.transactionType.id,
      value: createdTransaction.value,
      createdAt: new Date(),
    };

    //Persist event in Transaction Event table
    //await this.transactionsService.createTransactionEvent(createdTransactionEvent);

    //Emit created transaction event to Kafka Topic
    await this.producerService.produce("event-created", {
      value: JSON.stringify(createdTransactionEvent),
    });

    return createdTransaction;
  }

  async findTransactionTypeById(transactionTypeId: number) {
    return this.transactionTypeRepository.findOneBy({ id: transactionTypeId });
  }

  async findTransactionStatusById(transactionStatusId: number) {
    return this.transactionStatusRepository.findOneBy({
      id: transactionStatusId,
    });
  }

  async updateTransaction(updateTransactionInput: UpdateTransactionInput) {
    const transactionToUpdate = await this.transactionRepository.findOneBy({
      transactionExternalId: updateTransactionInput.transactionExternalId,
    });
    transactionToUpdate.transactionStatus = {
      id: updateTransactionInput.transactiontStatusId,
      name: TransactionStatus[updateTransactionInput.transactiontStatusId],
    };
    return this.transactionRepository.save(transactionToUpdate);
  }

  async seedData(): Promise<void> {
    const transctionTypeData: Partial<TransactionType>[] = [
      { id: 1, name: "Debit" },
      { id: 2, name: "Credit" },
    ];
    const transctionStatusData: Partial<TransactionStatus>[] = [
      { id: 1, name: "Pending" },
      { id: 2, name: "Approved" },
      { id: 3, name: "Rejected" },
    ];

    try {
      await this.transactionTypeRepository.save(transctionTypeData);
      await this.transactionStatusRepository.save(transctionStatusData);
    } catch (error) {
      console.error(`Error seeding data: ${error.message}`, error.stack);
    }
  }
}
