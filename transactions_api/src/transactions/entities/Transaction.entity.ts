import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { TransactionType } from "./TransactionType.entity";
import { TransactionStatus } from "./TransactionStatus.entity";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    transactionExternalId: string;

    @Column({ type: "uuid" })
    accountExternalIdDebit: string;

    @Column({ type: "uuid" })
    accountExternalIdCredit: string;

    @Column({ type: "int" })
    transactionTypeId: number;

    @ManyToOne(() => TransactionType)
    @JoinColumn({ name: "transactionTypeId" })
    transactionType: TransactionType;

    @Column({ type: "int", default: 1 })
    transactionStatusId: number;

    @ManyToOne(() => TransactionStatus)
    @JoinColumn({ name: "transactionStatusId" })
    transactionStatus: TransactionStatus;

    @Column({ type: "decimal" })
    value: number;

    @Column({ type: "timestamp" })
    createdAt: Date;
}
