import { Column, Entity,  PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
//import { BaseEntity } from "./base.entity";

@Entity('TypesTransaction')
export class TypeTransactionEntity extends BaseEntity {//extends BaseEntity{
    
    @PrimaryGeneratedColumn('identity',{ generatedIdentity:'ALWAYS', type:'smallint' })    
    id:number;
    
    @Column({type:'decimal',precision:10, scale:2})
    value: number;

   
}

