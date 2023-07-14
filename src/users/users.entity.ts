import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// eslint-disable-next-line prettier/prettier
@Entity({ name: 'Users' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountExternalIdDebit: number;

  @Column()
  accountExternalIdCredit: number;

  @Column()
  tranferTypeId: number;
}


