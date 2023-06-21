import { Entity, PrimaryColumn, Column, BaseEntity, Index } from "typeorm"

@Entity({name: "transactions"})
export class Transaction extends BaseEntity {
    @PrimaryColumn({type: "char", length:"36"})
    transactionExternalId: string;

    @Index("transactions-accountExternalIdDebit-idx")
    @Column({type: "char", length:"36"})
    accountExternalIdDebit: string;

    @Index("transactions-accountExternalIdCredit-idx")
    @Column({type: "char", length:"36"})
    accountExternalIdCredit: string;

    @Index("transactions-tranferTypeId-idx")
    @Column({type: "int", nullable: false})
    tranferTypeId: number;
    
    @Column({type: "double precision", nullable: false})
    value: number;

    @Index("transactions-status-idx")
    @Column({type: "int", nullable: false})
    status: number;

    @Column({nullable: false})
    createdAt: string;

    @Index("transactions-createdAtTimestamp-idx")
    @Column({type: "bigint", nullable: false})
    createdAtTimestamp: number;

    @Column({nullable: true})
    updatedAt: string;
    
    @Index("transactions-updatedAtTimestamp-idx")
    @Column({type: "bigint", nullable: true})
    updatedAtTimestamp: number;
}