import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsUUID, IsInt, Min, IsString } from 'class-validator';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @IsNotEmpty()
  @IsUUID()
  transactionExternalId: string;

  @Column()
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdDebit: string;

  @Column()
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdCredit: string;

  @Column({ default:1 })
  @IsNotEmpty()
  @IsInt()
  transferTypeId: number;

  @Column({ length: 8, default: "pending" })
  @IsNotEmpty()
  @IsString()
  transactionStatus: string;

  @Column()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}