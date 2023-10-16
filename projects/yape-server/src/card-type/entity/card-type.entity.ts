import { AbstractEntity } from '../../common/entities';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { UserCardsEntity } from 'src/user-cars/entity/user-cards.entity';
import { CardType } from 'src/common/constants';

@Entity({ name: 'card_types' })
export class CardTypeEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true, length: 50 })
  @IsString()
  name: string;

  @Column({
    type: 'enum',
    nullable: false,
    unique: true,
    enum: CardType,
    default: CardType.DEBIT,
  })
  @IsEnum(CardType)
  resource: string;

  @Column({ type: 'varchar', nullable: true, length: 250 })
  @IsString()
  description: string;

  @Column({ type: 'boolean', nullable: true, default: true })
  @IsBoolean()
  isActive: boolean;

  @OneToMany(
    () => UserCardsEntity,
    (userCards: UserCardsEntity) => userCards.cardType,
  )
  userCard: UserCardsEntity[];
}
