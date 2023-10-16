import { AbstractEntity } from 'src/common/entities';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserEntity } from 'src/users/entity/user.entity';
import { TransactionEntity } from 'src/transaction/entity/transaction.entity';
import { CardTypeEntity } from 'src/card-type/entity/card-type.entity';

@Entity({ name: 'user_cards' })
export class UserCardsEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: false, length: 60 })
  @IsNotEmpty({ message: 'The stripePaymentMethodId is required' })
  @IsString()
  stripePaymentMethodId: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  @IsNotEmpty({ message: 'The brand is required' })
  @IsString()
  brand: string;

  @Column({ type: 'varchar', nullable: false, length: 3 })
  @IsNotEmpty({ message: 'The country is required' })
  @IsString()
  country: string;

  @Column({ type: 'numeric', nullable: false })
  @IsNotEmpty({ message: 'The last4 is required' })
  @IsString()
  last4: number;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  @IsNotEmpty({ message: 'The funding is required' })
  @IsString()
  funding: string;

  @Column({ type: 'numeric', nullable: false })
  @IsNotEmpty({ message: 'The exp_month is required' })
  @IsNumber()
  exp_month: number;

  @Column({ type: 'numeric', nullable: false })
  @IsNotEmpty({ message: 'The exp_year is required' })
  @IsNumber()
  exp_year: number;

  @Column({ type: 'boolean', nullable: true })
  @IsBoolean()
  isActive: boolean;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userCards, {
    onDelete: 'CASCADE',
  })
  user?: UserEntity;

  @OneToMany(
    () => TransactionEntity,
    (transaction: TransactionEntity) => transaction.userCard,
  )
  transaction: TransactionEntity[];

  @ManyToOne(
    () => CardTypeEntity,
    (cardType: CardTypeEntity) => cardType.userCard,
    {
      onDelete: 'CASCADE',
    },
  )
  cardType?: CardTypeEntity;
}
