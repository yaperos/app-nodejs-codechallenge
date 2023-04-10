import { Service } from 'typedi';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Int,
  FieldResolver,
  Root,
} from 'type-graphql';
import {
  TransactionCreateInput,
  TransactionObjectType,
} from '../../types/transaction.type';
import { Transaction } from '../../models/transaction.model';
import { Kafka } from 'kafkajs';
import { TransactionTypeObjectType } from '../../types/transaction_type.type';
import { TransactionType } from '../../models/transaction_type.model';
import { StatusObjectType } from '../../types/status.type';
import { Status } from '../../models/status.model';
import appConfig from '../../config/app';

const kafka = new Kafka({
  clientId: 'qa-topic',
  brokers: [`${appConfig.kafka.host}:9092`],
});

const producer = kafka.producer();

producer.on('producer.connect', () => {
  console.log(`KafkaProvider: connected`);
});

@Service()
@Resolver((of) => TransactionObjectType)
export class TransactionResolver {
  @Query(() => TransactionObjectType, { nullable: true })
  async GetTransaction(
    @Arg('id', () => Int) id: number
  ): Promise<TransactionObjectType | null> {
    const transaction = await Transaction.findOne({ where: { id } });
    console.log('transaction => ', transaction?.accountExternalIdCredit);
    if (!transaction) return null;
    return transaction.dataValues;
  }

  @Mutation(() => Boolean)
  async CreateTransaction(
    @Arg('input') input: TransactionCreateInput
  ): Promise<true> {
    try {
      console.log('inout => ', input);

      const transaction = await Transaction.create({ ...input, status_id: 1 });

      await producer.connect();

      await producer.send({
        topic: 'test-topic',
        messages: [{ value: transaction.id.toString() }],
      });

      return true;
    } catch (e) {
      console.log('e => ', e);
      throw e;
    }
  }

  @FieldResolver(() => TransactionTypeObjectType, { nullable: true })
  async transactionType(@Root() transaction: TransactionObjectType) {
    const transactionType = await TransactionType.findByPk(
      transaction.tranferTypeId
    );

    return transactionType;
  }

  @FieldResolver(() => StatusObjectType, { nullable: true })
  async transactionStatus(@Root() transaction: TransactionObjectType) {
    const status = await Status.findByPk(transaction.status_id);

    return status;
  }
}
