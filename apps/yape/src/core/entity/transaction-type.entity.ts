import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity({name: 'transaction_types'})
export class TransactionTypeEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  static parseToEntity(data: any): TransactionTypeEntity {
    let entity = new TransactionTypeEntity();
    entity.id = data?.id;
    entity.name = data?.name;
    entity.description = data?.description;
    return entity;
  }
  
}