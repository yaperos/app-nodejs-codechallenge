import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TRANSACTION_STATUS, TRANSACTION_TYPES_EQUIVAL } from '../Common';

@ObjectType()
class TransactionType {
  @Field()
  name: String;
}
@ObjectType()
class TransactionStatus {
  @Field()
  name: string;
}

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryColumn({ type: 'uuid' })
  @Field()
  transactionExternalId: string;

  @Column({ type: 'varchar', length: 100 })
  @Field()
  accountExternalIdDebit: string;

  @Column({ type: 'varchar', length: 100 })
  @Field()
  accountExternalIdCredit: string;

  @Column({ type: 'int' })
  @Field((type) => Int)
  tranferTypeId: number;

  @Field({
    middleware: [
      ({ source }) => {
        const transactionStatus = TRANSACTION_TYPES_EQUIVAL.find(
          (item) => item.value === source.tranferTypeId,
        );
        return {
          name: transactionStatus
            ? transactionStatus.description
            : TRANSACTION_STATUS.UNKNOW,
        };
      },
    ],
  })
  transactionType: TransactionType;

  @Column({
    type: 'varchar',
    length: 100,
    transformer: {
      from(value) {
        return {
          name: value,
        };
      },
      to(value) {
        const { name } = value;
        return name;
      },
    },
  })
  @Field()
  transactionStatus: TransactionStatus;

  @Column({ type: 'int' })
  @Field((type) => Int)
  value: number;

  @Column({
    type: 'date',
    transformer: {
      from(value) {
        return new Date(value);
      },
      to(value) {
        return value;
      },
    },
  })
  @Field()
  createdAt: Date;
}
