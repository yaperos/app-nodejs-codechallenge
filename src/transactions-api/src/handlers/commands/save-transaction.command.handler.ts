import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveTransactionCommand } from './save-transaction.command';
import { Repository } from 'typeorm';
import { Transaction } from 'src/models/transaction.entity';
import { isEmpty } from 'lodash';
import { TransactionStatus, TransactionType } from 'src/models/enums';
import { KafkaProducerService } from 'src/services/kafka-producer.service';
import { ConfigService } from '@nestjs/config';

@CommandHandler(SaveTransactionCommand)
export class SaveTransactionCommandHandler
  implements ICommandHandler<SaveTransactionCommand>
{
  constructor(
    readonly repository: Repository<Transaction>,
    readonly kafkaService: KafkaProducerService,
    readonly configService: ConfigService,
  ) {}

  async execute(command: SaveTransactionCommand) {
    try {
      const transaction = new Transaction();
      transaction.tranferTypeId = command.tranferTypeId;
      transaction.createdAt = new Date();
      transaction.updatedAt = new Date();

      transaction.value = command.value;
      transaction.status = TransactionStatus.Pending;

      if (isEmpty(command.accountExternalIdDebit)) {
        transaction.accountExternalId = command.accountExternalIdCredit;
        transaction.transactionType = TransactionType.Credit;
      } else {
        transaction.accountExternalId = command.accountExternalIdDebit;
        transaction.transactionType = TransactionType.Debit;
      }

      const createdTransaction = await this.repository.save(transaction);

      this.kafkaService.produce({
        topic: this.configService.get('TRANSACTION_VALIDATE_TOPIC'),
        messages: [
          {
            key: transaction.accountExternalId,
            value: JSON.stringify({
              id: createdTransaction.id,
              value: createdTransaction.value,
            }),
          },
        ],
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
