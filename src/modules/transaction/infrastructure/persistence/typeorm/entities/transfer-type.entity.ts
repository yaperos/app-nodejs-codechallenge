import { Column, Entity, PrimaryColumn, Generated, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@Entity('Transfer_type')
export class TransferTypeEntity extends BaseEntity {
    @PrimaryColumn()
    @Generated('increment')
    id: number;

    @Column()
    name: string;
    
    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;
}