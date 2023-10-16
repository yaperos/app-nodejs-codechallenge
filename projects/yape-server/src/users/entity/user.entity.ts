import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Entity, Column, OneToMany, BeforeInsert } from 'typeorm';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from 'src/common/constants/gender.constant';
import { UserCardsEntity } from 'src/user-cars/entity/user-cards.entity';
import { TransactionEntity } from '../../transaction/entity/transaction.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: false, length: 50 })
  @IsNotEmpty({ message: 'The name is required' })
  @IsString()
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: false, length: 100 })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  @IsNotEmpty({ message: 'The username is required' })
  @IsString()
  username: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false,
    default: Gender.OTHER,
  })
  @IsNotEmpty({ message: 'The gender is required' })
  @IsString()
  gender: Gender;

  @Column({ type: 'varchar', select: false, nullable: false, length: 60 })
  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
  password: string;

  @Column({ type: 'timestamp', nullable: false })
  @IsNotEmpty({ message: 'The birthday is required' })
  @IsDate()
  birthday: Date;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  @IsNotEmpty({ message: 'The stripeCostumerId is required' })
  @IsString()
  stripeCostumerId: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @OneToMany(
    () => UserCardsEntity,
    (userCards: UserCardsEntity) => userCards.user,
  )
  userCards: UserCardsEntity[];

  @OneToMany(
    () => TransactionEntity,
    (transaction: TransactionEntity) => transaction.user,
  )
  transaction: TransactionEntity[];
}
