import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm"

@Entity("tranfer_status")
export class TransactionStatus extends BaseEntity {
    @PrimaryGeneratedColumn({type:"bigint"})
    id: number

    @Column({nullable: false, type:"bigint"})
    name: string

    @CreateDateColumn()
    createdAt: Date
}
