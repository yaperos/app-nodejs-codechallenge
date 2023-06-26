import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveTransactionCommand } from './save-transaction.command';
import { Repository } from 'typeorm';
import { Transaction } from 'src/models/transaction.entity';
import { isEmpty } from 'lodash';
import { TransactionStatus, TransactionType } from 'src/models/enums';
import { KafkaProducerService } from 'src/services/kafka-producer.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidateTransaction } from 'src/types/validate-transction';

@CommandHandler(SaveTransactionCommand)
export class SaveTransactionCommandHandler
  implements ICommandHandler<SaveTransactionCommand>
{
  constructor(
    @InjectRepository(Transaction)
    readonly repository: Repository<Transaction>,
    readonly kafkaService: KafkaProducerService,
    readonly configService: ConfigService,
  ) {}

  async execute(command: SaveTransactionCommand) {
    try {
      const transaction = new Transaction();
      transaction.transferTypeId = command.transferTypeId;
      transaction.createdAt = new Date();
      transaction.updatedAt = new Date();

      transaction.value = command.value;
      transaction.status = TransactionStatus.PENDING;

      if (isEmpty(command.accountExternalIdDebit)) {
        transaction.accountExternalId = command.accountExternalIdCredit;
        transaction.transactionType = TransactionType.CREDIT;
      } else {
        transaction.accountExternalId = command.accountExternalIdDebit;
        transaction.transactionType = TransactionType.DEBIT;
      }

      const createdTransaction = await this.repository.save(transaction);

      const payload: ValidateTransaction = {
        id: createdTransaction.id,
        value: createdTransaction.value,
      };

      await this.kafkaService.produce({
        topic: this.configService.get('TRANSACTION_VALIDATE_TOPIC'),
        messages: [
          {
            key: crypto.randomUUID(),
            value: JSON.stringify(payload),
          },
        ],
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
