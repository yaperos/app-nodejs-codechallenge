import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm"

@Entity("transactions")
export class Transaction extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    transactionExternalId: string

    @Column({nullable: true, type:"uuid"})
    accountExternalIdDebit: string

    @Column({nullable: true, type:"uuid"})
    accountExternalIdCredit: string

    @Column({ nullable: false})
    tranferTypeId: number

    @Column({nullable: true, default: 1})
    tranferStatusId: number

    @Column({nullable: false})
    value:number

    @CreateDateColumn()
    createdAt: Date
}
