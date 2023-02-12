import {TransactionStatus} from "./status.enum";
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    accountExternalIdDebit: string;

    @Column()
    accountExternalIdCredit: string;

    @Column()
    transferTypeId: number;

    @Column()
    value: number;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PENDING,
    })
    status: TransactionStatus;

    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date;

    @CreateDateColumn({type: 'timestamptz'})
    updatedAt: Date;
}