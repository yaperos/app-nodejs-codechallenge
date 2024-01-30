import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "transaction" })
export class TransactionEntity {
    @PrimaryColumn()
    transactionId: string

    @Column({ type: "varchar", length: 50 })
    accountExternalIdDebit: string

    @Column({ type: "varchar", length: 50 })
    accountExternalIdCredit: string

    @Column()
    transferTypeId: number

    @Column()
    value: number

    @Column({ type: "varchar", length: 10 })
    status: string

    @Column()
    createdAt: Date

    @Column({ nullable: true })
    updateAt: Date
}
