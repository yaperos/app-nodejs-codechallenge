import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm"

@Entity({name: "transactions"})
export class Transaction extends BaseEntity {
    @PrimaryColumn({type: "char", length:"36"})
    transactionExternalId: string;

    @Column({type: "char", length:"36"})
    accountExternalIdDebit: string;

    @Column({type: "char", length:"36"})
    accountExternalIdCredit: string;

    @Column({type: "int", nullable: false})
    tranferTypeId: number;
    
    @Column({type: "double precision", nullable: false})
    value: number;

    @Column({type: "int", nullable: false})
    status: number;

    @Column({nullable: false})
    createdAt: string;

    @Column({type: "bigint", nullable: false})
    createdAtTimestamp: number;

    @Column({nullable: true})
    updatedAt: string;
    
    @Column({type: "bigint", nullable: true})
    updatedAtTimestamp: number;
}