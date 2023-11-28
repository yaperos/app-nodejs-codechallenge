import {
  Inject,
  Injectable,
  OnModuleInit,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { CreateTransactionEvent } from './dtos/create.transaction.event';
import { TransactionEntity } from './entities/transaction.entity';
import { UpdateTransactionDto } from './dtos/update.transaction.dto';
import { CreateTransactionRequestDto } from './dtos/create.transaction.request.dto';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('ANTI_FRAUD') private readonly antiFraudClient: ClientKafka,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
  ) {}

  async onModuleInit() {
    this.antiFraudClient.subscribeToResponseOf('anti-fraud');
    await this.antiFraudClient.connect();
  }

  // Crear una transacción
  async createTransaction(transactionReq: CreateTransactionRequestDto) {
    const newTransaction = {
      transactionExternalId: uuidv4(),
      ...transactionReq,
      transactionStatus: 'pending',
    };
    const transactionBeforeAntifraude =
      await this.transactionRepository.save(newTransaction);

    this.antiFraudClient
      .send(
        'anti-fraud',
        new CreateTransactionEvent(
          transactionBeforeAntifraude.id,
          transactionBeforeAntifraude.transactionExternalId,
          transactionBeforeAntifraude.transactionStatus,
          transactionBeforeAntifraude.value,
        ),
      )
      .subscribe({
        next: (transactionAfterAntifraude) => {
          this.transactionRepository.update(
            { id: transactionBeforeAntifraude.id },
            { transactionStatus: transactionAfterAntifraude.transactionStatus },
          );
        },
        error: (e) => {
          const messageError = `The following error occurred while creating the transaction: ${e}`;
          console.error(messageError);
          throw new InternalServerErrorException(messageError);
        },
        complete: () => console.info('Transaction validation completed...'),
      });

    return {
      message: `Transaction with id ${transactionBeforeAntifraude.id} successfully registered.`,
      error: '',
      statusCode: 200,
    };
  }

  // Obtener todas las transacciones
  async findAll() {
    return await this.transactionRepository.find({
      order: { id: 'ASC' },
    });
  }

  // Obtener una sola transacción
  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new BadRequestException(`No transactions found with id ${id}`);
    }
    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.tranferTypeId,
      },
      transactionStatus: {
        name: transaction.transactionStatus,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }

  // Actualizar una transacción
  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const resp = await this.transactionRepository.update(
      { id },
      { ...updateTransactionDto },
    );

    if (resp.affected) {
      throw new BadRequestException(`Transaction with id ${id} not exist.`);
    }

    return {
      message: `Transaction with id ${id} successfully updated.`,
      error: '',
      statusCode: 200,
    };
  }

  // Eliminar una transacción
  async remove(id: number) {
    const resp = await this.transactionRepository.softDelete(id);

    if (resp.affected) {
      throw new BadRequestException(`Transaction with id ${id} not exist.`);
    }

    return {
      message: `Transaction with id ${id} successfully deleted.`,
      error: '',
      statusCode: 200,
    };
  }
}
