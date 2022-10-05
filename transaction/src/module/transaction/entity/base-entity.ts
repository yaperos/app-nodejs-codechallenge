import { Column, CreateDateColumn, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity{

    @PrimaryColumn()
    id?: string;
    
    @Column({type: 'varchar', length: 1, nullable: false})
    active?: string;

    @Column({name: 'createdby', type: 'varchar', length: 30, nullable: false})
    createdBy?: string;

    @CreateDateColumn({name: 'createdat', nullable: false})
    createdAt?: Date;

    @Column({name: 'updatedby', type: 'varchar', length: 30, nullable: true})
    updatedBy?: string;

    @CreateDateColumn({name: 'updatedat', nullable: true})
    updatedAt?: Date;
}