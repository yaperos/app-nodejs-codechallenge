import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity} from "typeorm"

@Entity("tranfer_types")
export class TransactionType extends BaseEntity {
    @PrimaryGeneratedColumn({type:"bigint"})
    id: number

    @Column({nullable: false, type:"bigint"})
    name: string

    @CreateDateColumn()
    createdAt: Date
}
