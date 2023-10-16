import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { IsNumber } from 'class-validator';
import { UserEntity } from 'src/users/entity/user.entity';
import { UserCardsEntity } from 'src/user-cars/entity/user-cards.entity';
import { StatusTransaction } from 'src/common/constants/statusTransaction.constant';

@Entity({ name: 'transactions' })
export class TransactionEntity extends AbstractEntity {
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  @IsNumber()
  amount: number;

  @Column({
    type: 'enum',
    enum: StatusTransaction,
    nullable: false,
    default: StatusTransaction.PENDING,
  })
  status: StatusTransaction;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.transaction, {
    onDelete: 'CASCADE',
  })
  user?: UserEntity;

  @ManyToOne(
    () => UserCardsEntity,
    (userCard: UserCardsEntity) => userCard.transaction,
    {
      onDelete: 'CASCADE',
    },
  )
  userCard?: UserCardsEntity;
}
