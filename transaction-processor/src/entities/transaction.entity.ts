import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public accountExternalIdDebit!: string;

  @Column()
  public accountExternalIdCredit!: string;

  @Column()
  public transferTypeId!: number;

  @Column()
  public value!: number;

  @Column({ default: 'pending' })
  public status!: string;
}
